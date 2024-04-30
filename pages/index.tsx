import { getStoreApi } from "@shared/apis";
import { SelectedMenu } from "@shared/atoms";
import { SaleAlert, SideNavigation } from "@shared/components";
import { KakaoMap } from "@shared/components/map";
import { QueryKey } from "@shared/constants";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import type { GetServerSideProps, NextPage } from "next";
import { useRecoilState } from "recoil";
import styled from "styled-components";

const Home: NextPage = () => {
  const [currentMenu] = useRecoilState(SelectedMenu);

  return (
    <Container>
      <SideNavigation />
      {currentMenu !== "할인 소식" ? <KakaoMap /> : <SaleAlert />}
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery(
      [QueryKey.store],
      async () => await getStoreApi(),
    );
  } catch (error) {
    console.log(error, "error");
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const Container = styled.div`
  display: flex;
  width: 100dvw;
  height: 100dvh;
`;

export default Home;
