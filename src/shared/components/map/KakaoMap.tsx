import { Map } from "react-kakao-maps-sdk";
import styled from "styled-components";
import Marker_ComparePrice from "./Marker_ComparePrice";
import { useState, useEffect } from "react";
import { SyncLoader } from "react-spinners";
import locateBtnImage from "@shared/assets/locateBtn.png";
import { useRecoilState, useRecoilValue } from "recoil";
import { mapCenterState, markersState } from "@shared/atoms/MapState";
import axios from "axios";
import Marker_FindStore from "./Marker_FindStore";
import { SelectedMenu } from "@shared/atoms";
import DistrictSelector from "./DistrictSelector";

const KakaoMap = () => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useRecoilState(mapCenterState);
  const [markers, setMarkers] = useRecoilState(markersState);
  const currentMenu = useRecoilValue(SelectedMenu);
  const [mapKey, setMapKey] = useState(Date.now());


  const updateMapCenter = (lng: number, lat: number) => {
    setMapCenter({ lng, lat });
    map.setCenter(new kakao.maps.LatLng(lat, lng));
    map.setLevel(3); 

  };

  const handleDistrictChange = (location: { latitude: number; longitude: number; }) => {
    if (location.latitude && location.longitude) {
      updateMapCenter(location.latitude, location.longitude);
    }
  };

  const handleLocate = () => {
    if (map) {
      setMapCenter({ lat: 37.554722, lng: 126.970833 }); // 서울역 좌표
    }
  };

  const loadMarketData = (apiUrl: string | undefined) => {
    axios
      .get(`${apiUrl}/market/market-place/get`)
      .then((response) => {
        const filteredData = response.data.filter(
          (market) => market.marketName !== '약수시장 골목형 상가'
        );
        const newMarkers = filteredData.map(
          (market: { marketName: any }, index: any) => ({
            id: index,
            name: market.marketName,
            added: false,
            focus: false,
          }),
        );
        setMarkers(newMarkers);
        console.log(response.data);
      })
      .catch((error) => console.error("Failed to fetch market data:", error));
  };

  useEffect(() => {
    console.log("카카오맵 렌더링");

    const { geolocation } = navigator;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (currentMenu === '시장 가격 비교') {
      setIsLoading(true);
      loadMarketData(apiUrl);
    }

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
  }, [map, currentMenu]);

  // function removeBorderFromMapElement() {
  //   const element = document.querySelector("#__react-kakao-maps-sdk___Map > div:nth-child(1) > div > div:nth-child(6) > div:nth-child(107)") as HTMLElement;
  //   if (element) {
  //     element.style.border = 'none';
  //     element.style.zIndex = '3';
  //   }
  // }

  useEffect(() => {
    setMapKey(Date.now());
  }, [currentMenu])

  return (
    <MapContainer $isLoading={isLoading}>
      {isLoading ? (
        <>
          <p>위치 정보를 불러오는 중입니다.</p>
          <SyncLoader color="#79CF9F" speedMultiplier={0.6} />
        </>
      ) : (
        <>
            <DistrictSelector onDistrictChange={handleDistrictChange} />
          <Map
            key={mapKey}
            center={{ lat: mapCenter.lat, lng: mapCenter.lng }}
            style={{ width: "100%", height: "100%" }}
            level={3}
            onCreate={setMap}
          >
            {currentMenu == '시장 가격 비교' && map && <Marker_ComparePrice map={map} />}
            {currentMenu == '알뜰 가게 찾기' && map && <Marker_FindStore map={map} />}
            {/* { map && <Marker map={map} />} */}
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
  position: relative;
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
