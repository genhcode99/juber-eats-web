import { gql, useMutation, useSubscription } from "@apollo/client"
import GoogleMapReact from "google-map-react"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { FULL_ORDER_FRAGMENT } from "../../fragments"
import { cookedOrders } from "../../graphql_type/cookedOrders"
import { takeOrder, takeOrderVariables } from "../../graphql_type/takeOrder"

// <==========( Graphql )==========>
const COOKED_ORDER_SUBSCRIPTION = gql`
  subscription cookedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`
const Take_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`

// <==========( Settings )==========>
interface ICoords {
  latitude: number
  longitude: number
}

// <==========( Feature )==========>
export const DashBoard = () => {
  // <State>
  const [driverCoords, setDriverCoords] = useState<ICoords>({
    latitude: 0,
    longitude: 0,
  })
  const [map, setMap] = useState<google.maps.Map>()
  const [maps, setMaps] = useState<any>()

  // <위도,경도 가져오기>
  const onSucces = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setDriverCoords({ latitude, longitude })
  }
  const onError = (error: GeolocationPositionError) => {
    console.log(error)
  }
  useEffect(() => {
    navigator.geolocation.watchPosition(onSucces, onError, {
      enableHighAccuracy: true,
    })
  }, [])

  // <현재 좌표로 주소를 가져옴>
  useEffect(() => {
    if (map && maps) {
      map.panTo(
        new google.maps.LatLng(driverCoords.latitude, driverCoords.longitude),
      )
      /* const geocoder = new google.maps.Geocoder()
      geocoder.geocode(
        {
          location: new google.maps.LatLng(
            driverCoords.latitude,
            driverCoords.longitude,
          ),
        },
        (results, status) => {
          console.log(status, results)
        },
      )*/
    }
  }, [driverCoords.longitude, driverCoords.latitude, map, maps])

  // <현재위치로 이동, state 설정>
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(
      new google.maps.LatLng(driverCoords.latitude, driverCoords.longitude),
    )
    setMap(map)
    setMaps(maps)
  }

  // <경로찾기>
  const makeRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService()
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: "#000",
          strokeOpacity: 1,
          strokeWeight: 5,
        },
      })
      directionsRenderer.setMap(map)

      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.latitude,
              driverCoords.longitude,
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              driverCoords.latitude + 0.05,
              driverCoords.longitude + 0.05,
            ),
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          directionsRenderer.setDirections(result)
        },
      )
    }
  }

  // <Subscription>
  const { data: cookedOrdersData } = useSubscription<cookedOrders>(
    COOKED_ORDER_SUBSCRIPTION,
  )
  useEffect(() => {
    if (cookedOrdersData?.cookedOrders.id) {
      makeRoute()
    }
  }, [cookedOrdersData])

  // <배달수락>
  const history = useHistory()
  const onCompleted = (data: takeOrder) => {
    if (data.takeOrder.ok) {
      history.push(`/orders/${cookedOrdersData?.cookedOrders.id}`)
    }
  }
  const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(
    Take_ORDER_MUTATION,
    { onCompleted },
  )
  const triggerMutation = (id: number) => {
    takeOrderMutation({ variables: { input: { id } } })
  }

  // <==========( Presenter )==========>
  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: "60vh" }}
      >
        <GoogleMapReact
          defaultZoom={16}
          defaultCenter={{ lat: 36.31, lng: 126.88 }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP! }}
        >
          {/* <Driver lat={driverCoords.latitude} lng={driverCoords.longitude} /> */}
        </GoogleMapReact>
      </div>
      <div className="max-w-screen-sm mx-auto bg-white relative -top-20 shadow-lg py-8 px-5">
        {cookedOrdersData?.cookedOrders ? (
          <>
            <h1 className="text-center text-3xl font-medium">
              New Cooked Order
            </h1>
            <h4 className="text-center text-2xl font-medium my-3">
              Pick it up soon! @{cookedOrdersData.cookedOrders.restaurant?.name}
            </h4>
            <button
              onClick={() => triggerMutation(cookedOrdersData.cookedOrders.id)}
              className="btn w-full block text-center mt-5"
            >
              Accept Challenge &rarr;
            </button>
          </>
        ) : (
          <>
            <h1 className="text-center text-3xl font-medium">No Orders Yet</h1>
          </>
        )}
      </div>
    </div>
  )
}
