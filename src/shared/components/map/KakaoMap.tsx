import { Coords } from "@shared/types";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import styled from "styled-components";
import Marker from "./Marker";
import { useState, useEffect } from "react";
import { mockMarker } from "@shared/constants";
import { SyncLoader } from "react-spinners";
import locateBtnImage from '@shared/assets/locateBtn.png';

interface KakaoMapProps {
  center: Coords;
}

const KakaoMap = ({ center }: KakaoMapProps) => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const markers = mockMarker(center);
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<Coords>({
    lat: 33.5563,
    lng: 126.79581,
  });

  const handleLocate = () => {
    if (map) {
      map.setCenter(new kakao.maps.LatLng(37.554722, 126.970833)); // 서울역 좌표
    }
  };

  useEffect(() => {
    const { geolocation } = navigator;

    geolocation.getCurrentPosition(
      ({ coords }) => {
        const userCoords = {
          // lat: coords.latitude,
          // lng: coords.longitude,
          lat: 37.5545, // 임시로 현재위치를 서울역 으로 설정
          lng: 126.9706,
        };
        setMapCenter(userCoords);
        setIsLoading(false);
      },
      (error) => {
        console.warn("Fail to fetch current location", error);
        alert("위치 정보 사용에 동의해주세요");
      },
    );
    if (map) {
      const zoomControl = new kakao.maps.ZoomControl();
      map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
    }
  }, [map]);

  return (
    <MapContainer $isLoading={isLoading}>
      {isLoading ? (
        <>
          <p>위치 정보를 불러오는 중입니다.</p>
          <SyncLoader color="#79CF9F" speedMultiplier={0.6} />
        </>
      ) : (
        <>
          <Map
            center={{ lat: center.lat, lng: center.lng }}
            style={{ width: '100%', height: '100%' }}
            level={3}
            onCreate={setMap}
          >
            <MapMarker position={{
              lat: center.lat,
              lng: center.lng
            }}>현재위치</MapMarker>
            {map && <Marker markers={markers} map={map} />}
          </Map>
          <HandleLocateBtn onClick={handleLocate} />
        </>
      )}
    </MapContainer>

  );
};


const MapContainer = styled.div<{ $isLoading?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 1000px;
  background-color: #ccc;
  align-items: center;
  justify-content: center;
  color: ${({ $isLoading }) => ($isLoading ? "white" : "black")};
`;

const HandleLocateBtn = styled.button`
  position: absolute;
  right: 10px;
  bottom: 50px;
  background: url(${locateBtnImage.src}) no-repeat center center;
  border: none;
  width: 40px;
  height: 50px;
  cursor: pointer;
  z-index: 1;
`;

export default KakaoMap;
