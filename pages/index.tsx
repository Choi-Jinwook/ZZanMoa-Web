import { getStoreApi } from "@shared/apis";
import { SideNavigation } from "@shared/components";
import { KakaoMap } from "@shared/components/map";
import { QueryKey } from "@shared/constants";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import type { GetServerSideProps, NextPage } from "next";
import styled from "styled-components";

const Home: NextPage = () => {
  return (
    <Container>
      <SideNavigation />
      <KakaoMap />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [QueryKey.store],
    async () => await getStoreApi(),
  );

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
