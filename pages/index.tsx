import { Coords } from "@shared/types";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

const Home: NextPage = () => {
  const [mapCenter, setMapCenter] = useState<Coords>({
    lat: 33.5563,
    lng: 126.79581,
  });

  useEffect(() => {
    const { geolocation } = navigator;

    geolocation.getCurrentPosition(
      (position) => {
        setMapCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("Fail to fetch current location", error);
        alert("위치 정보 사용에 동의해주세요");
        setMapCenter({
          lat: 33.5563,
          lng: 126.79581,
        });
      },
    );
  }, []);

  return (
    <Map
      center={{ lat: mapCenter.lat, lng: mapCenter.lng }}
      style={{ width: "100%", height: "360px" }}
    >
      <MapMarker position={{ lat: mapCenter.lat, lng: mapCenter.lng }}>
        <div style={{ color: "#000" }}>Hello World!</div>
      </MapMarker>
    </Map>
  );
};

export default Home;
