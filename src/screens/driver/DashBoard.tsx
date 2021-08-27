import React, { useEffect, useState } from "react"
import GoogleMapReact from "google-map-react"

// <==========( Settings )==========>
interface ICoords {
  latitude: number
  longitude: number
}

// <==========( Feature )==========>
export const DashBoard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({
    latitude: 0,
    longitude: 0,
  })

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

  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    setTimeout(() => {
      map.panTo(new maps.LatLng(driverCoords.latitude, driverCoords.longitude))
    }, 5000)
  }

  // <==========( Presenter )==========>
  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: "95vh" }}
      >
        <GoogleMapReact
          defaultZoom={15}
          defaultCenter={{ lat: 36.31, lng: 126.88 }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP! }}
        ></GoogleMapReact>
      </div>
    </div>
  )
}
