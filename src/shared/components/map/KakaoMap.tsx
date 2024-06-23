import { Map } from "react-kakao-maps-sdk";
import styled from "styled-components";
import Marker_ComparePrice from "./ComparePrice/Marker_ComparePrice";
import { useState, useEffect } from "react";
import { SyncLoader } from "react-spinners";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { mapCenterState, markersState } from "@shared/atoms/MapState";
import axios from "axios";
import { SelectedMenu } from "@shared/atoms";
import DistrictSelector from "./DistrictSelector";
import { CurrentPrice, SelectedCategory } from "@shared/atoms";
import { useQuery } from "@tanstack/react-query";
import { StoreData } from "@shared/types";
import { QueryKey } from "@shared/constants";
import { storeMarkerState } from "@shared/atoms/storeMarkerState";
import Marker_FindStore from "./FindStore/Marker_FindStore";

const KakaoMap = () => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useRecoilState(mapCenterState);
  const [markers, setMarkers] = useRecoilState(markersState);
  const currentMenu = useRecoilValue(SelectedMenu);
  const [mapKey, setMapKey] = useState(Date.now());

  const setStoreMarkers = useSetRecoilState(storeMarkerState);
  // const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  // const [activeMarker, setActiveMarker] = useState(null);

  const [currentCategory] = useRecoilState(SelectedCategory);
  const [currentPrice] = useRecoilState(CurrentPrice);

  const { data: storeData } = useQuery([QueryKey.store], async () => {
    const res = await axios.get<StoreData[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/saving-place/get/store`,
    );

    return res.data;
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const updateMapCenter = (lng: number, lat: number) => {
    if (map) {
      setMapCenter({ lng, lat });
      map.setCenter(new kakao.maps.LatLng(lat, lng));
      map.setLevel(5);
    } else {
      console.error("Map 객체가 초기화되지 않았습니다.");
    }
  };

  const handleDistrictChange = (location: {
    latitude: number;
    longitude: number;
  }) => {
    if (location.latitude && location.longitude) {
      updateMapCenter(location.latitude, location.longitude);
    }
  };

  const updateCurrentLocation = () => {
    if (map) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            const userCoords = {
              lat: coords.latitude,
              lng: coords.longitude,
            };
            setMapCenter(userCoords);
            map.setCenter(
              new kakao.maps.LatLng(userCoords.lat, userCoords.lng),
            );
            map.setLevel(3);
          },
          (error) => {
            console.error("Geolocation error:", error);
            alert(
              "위치 정보를 가져오는데 실패했습니다. 위치 권한을 확인해주세요.",
            );
          },
        );
      } else {
        alert("이 브라우저에서는 위치 서비스를 사용할 수 없습니다.");
      }
    } else {
      console.error("Map 객체가 초기화되지 않았습니다.");
    }
  };

  const handleLocate = () => {
    if (map) {
      updateCurrentLocation();
    }
  };

  const loadMarketData = (apiUrl: string | undefined) => {
    return axios
      .get(`${apiUrl}/market/market-place/get`)
      .then((response) => {
        const newMarkers = response.data.map(
          (market: {
            marketName: string;
            latitude: number;
            longitude: number;
            marketId: string;
          }) => ({
            id: market.marketId,
            name: market.marketName,
            latitude: market.latitude,
            longitude: market.longitude,
            added: false,
            focus: false,
          }),
        );
        setMarkers(newMarkers);
        console.log("Markers loaded:", newMarkers);
      })
      .catch((error) => {
        console.error("Failed to fetch market data:", error);
      });
  };

  const getFilteredStores = (stores: StoreData[]) => {
    return stores.filter(({ items }) => {
      if (currentCategory === "") {
        return true;
      } else {
        return items.some(
          ({ category, price }) =>
            category.includes(currentCategory.split(" ").reverse()[0]) &&
            price >= currentPrice.minPrice &&
            price <= currentPrice.maxPrice,
        );
      }
    });
  };

  useEffect(() => {
    const filteredStores = getFilteredStores(storeData || []);
    setStoreMarkers(filteredStores);
  }, [currentCategory, currentPrice]);

  useEffect(() => {
    const { geolocation } = navigator;

    geolocation.getCurrentPosition(
      ({ coords }) => {
        const userCoords = {
          lat: coords.latitude || 37.5545,
          lng: coords.longitude || 126.9706,
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

  useEffect(() => {
    if (currentMenu === "시장 가격 비교") {
      setIsLoading(true);
      loadMarketData(apiUrl)
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setIsLoading(false);
        });
    }
  }, [currentMenu, apiUrl]);

  const filteredStores = getFilteredStores(storeData || []);

  useEffect(() => {
    setMapKey(Date.now());
  }, [currentMenu]);

  const closeInfoWindow = () => {
    // setActiveInfoWindow(null);
  };

  return (
    <MapContainer $isLoading={isLoading}>
      {isLoading ? (
        <>
          <p>위치 정보를 불러오는 중입니다.</p>
          <SyncLoader color="#79CF9F" speedMultiplier={0.6} />
        </>
      ) : (
        <>
          <DistrictSelector
            onDistrictChange={handleDistrictChange}
            currentLocation={mapCenter}
          />
          <Map
            key={mapKey}
            center={{ lat: mapCenter.lat, lng: mapCenter.lng }}
            style={{ width: "100%", height: "100%" }}
            level={3}
            onCreate={setMap}
          >
            {currentMenu === "알뜰 가게 찾기" &&
              map &&
              filteredStores.map((store) => (
                <Marker_FindStore
                  key={store.storeId}
                  map={map}
                  position={{ lat: store.latitude, lng: store.longitude }}
                  content={store.storeName}
                  onClose={closeInfoWindow}
                  store={store}
                />
              ))}
            {currentMenu === "시장 가격 비교" && map && (
              <Marker_ComparePrice map={map} />
            )}
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
  bottom: 10px;
  background: url("/images/locateBtn.svg") no-repeat center center;
  border-radius: 4px;
  background-color: white;
  border: 1px solid #e7e7e9;
  width: 56px;
  height: 56px;
  cursor: pointer;
  z-index: 3;
  box-shadow:
    0px 8px 16px rgba(0, 0, 0, 0.14),
    0px 0px 2px rgba(0, 0, 0, 0.12);
  box-sizing: border-box;
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;

  &:hover {
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  }
`;

export default KakaoMap;
