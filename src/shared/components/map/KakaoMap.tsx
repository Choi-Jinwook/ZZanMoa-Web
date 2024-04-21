import { Coords, MarkerInfo } from "@shared/types";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import styled from "styled-components";
import Marker from "./Marker";
import { useState, useEffect } from "react";
import { mockMarker } from "@shared/constants";
import { SyncLoader } from "react-spinners";
import locateBtnImage from "@shared/assets/locateBtn.png";
import { useRecoilState } from "recoil";
import { mapCenterState, markersState } from "@shared/atoms/MapState";



const KakaoMap = () => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useRecoilState(mapCenterState);
  const [markers, setMarkers] = useRecoilState(markersState);

  const handleLocate = () => {
    if (map) {
      setMapCenter({ lat: 37.554722, lng: 126.970833 }); // 서울역 좌표
    };
  }

  useEffect(() => {
    const { geolocation } = navigator;
    const markerData = mockMarker(mapCenter).map((marker, index) => ({
      ...marker,
      id: index,
      added: false,
      focus: false,
    }));
    setMarkers(markerData);

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

  // function removeBorderFromMapElement() {
  //   const element = document.querySelector("#__react-kakao-maps-sdk___Map > div:nth-child(1) > div > div:nth-child(6) > div:nth-child(107)") as HTMLElement;
  //   if (element) {
  //     element.style.border = 'none';
  //     element.style.zIndex = '3';
  //   }
  // }

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
            center={{ lat: mapCenter.lat, lng: mapCenter.lng }}
            style={{ width: "100%", height: "100%" }}
            level={3}
            onCreate={setMap}
          >
            {map && <Marker map={map} />}
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
  width: calc(100% - 473px);
  height: 100%;
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
  z-index: 3;
`;

export default KakaoMap;
