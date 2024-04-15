import { SideNavigation } from "@shared/components/SideNavigation";
import { KakaoMap } from "@shared/components/map";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Home: NextPage = () => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const center = { lat: 37.554722, lng: 126.970833 };

  return (
    <Container>
      <SideNavigation />
      <KakaoMap center={center}/>
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

const SideBar = styled.div`
  width: 250px; 
  background-color: #FFF; 
  height: 100%;
`;

const ContentArea = styled.div`
  flex-grow: 1;
  overflow: hidden;
  position: relative;
`;

export default Home;