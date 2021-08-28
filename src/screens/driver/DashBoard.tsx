import React, { useEffect, useState } from "react"
import GoogleMapReact from "google-map-react"

// <==========( Settings )==========>
interface ICoords {
  latitude: number
  longitude: number
}

interface IDriverProps {
  lat: number
  lng: number
  $hover?: any
}

const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🚘</div>

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
  }, [driverCoords.longitude, driverCoords.latitude])

  // <현재위치로 이동, state 설정>
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(
      new google.maps.LatLng(driverCoords.latitude, driverCoords.longitude),
    )
    setMap(map)
    setMaps(maps)
  }

  // <onClick 기능 :경로찾기>
  const onGetRouteClick = () => {
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

  // <==========( Presenter )==========>
  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: "50vh" }}
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
      <button onClick={onGetRouteClick}>Get route</button>
    </div>
  )
}
