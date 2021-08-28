import React, { useEffect, useState } from "react"
import GoogleMapReact from "google-map-react"

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
  const [map, setMap] = useState<any>()
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

  useEffect(() => {
    if (map && maps) {
      map.panTo(new maps.LatLng(driverCoords.latitude, driverCoords.longitude))
    }
  }, [driverCoords.longitude, driverCoords.latitude])

  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new maps.LatLng(driverCoords.latitude, driverCoords.longitude))
    setMap(map)
    setMaps(maps)
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
          <div
            // @ts-ignore
            lat={driverCoords.latitude}
            lng={driverCoords.longitude}
            className="text-lg"
          >
            🚘
          </div>
        </GoogleMapReact>
      </div>
    </div>
  )
}
