import { SideNavigation } from "@shared/components/SideNavigation";
import { KakaoMap } from "@shared/components/map";
import type { NextPage } from "next";
import styled from "styled-components";

const Home: NextPage = () => {

  return (
    <Container>
      <SideNavigation />
      <KakaoMap />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;


export default Home;