import { SideNavigation } from "@shared/components/SideNavigation";
import { KakaoMap } from "@shared/components/map";
import { mockMarker } from "@shared/constants";
import { Coords } from "@shared/types";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import styled from "styled-components";

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<Coords>({
    lat: 33.5563,
    lng: 126.79581,
  });

  useEffect(() => {
    const { geolocation } = navigator;

    geolocation.getCurrentPosition(
      ({ coords }) => {
        const userCoords = {
          lat: coords.latitude,
          lng: coords.longitude,
        };
        setMapCenter(userCoords);
        setIsLoading(false);
      },
      (error) => {
        console.warn("Fail to fetch current location", error);
        alert("위치 정보 사용에 동의해주세요");
      },
    );
  }, []);

  return (
    <Container>
      <SideNavigation />
      <MapContainer $isLoading={isLoading}>
        {isLoading ? (
          <>
            <p>위치 정보를 불러오는 중입니다.</p>
            <SyncLoader color="#79CF9F" speedMultiplier={0.6} />
          </>
        ) : (
          <KakaoMap mockMarker={mockMarker(mapCenter)} center={mapCenter} />
        )}
      </MapContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

const MapContainer = styled.div<{ $isLoading?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #ccc;
  align-items: center;
  justify-content: center;
  color: ${({ $isLoading }) => ($isLoading ? "white" : "black")};
`;

export default Home;
