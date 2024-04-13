import type { NextPage } from "next";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Navigation } from "@shared/components/NavBar";
import { FindStore } from "./FindStore";
import { DiscountNews } from "./DiscountNews";
import { PriceComparision } from "./PriceComparision";

type Tab = 'findStore' | 'priceComparison' | 'discountNews';

const Home: NextPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('findStore');

  return (
    <MainContainer>
      <SideBar>
        <Navigation onTabChange={setActiveTab} />
      </SideBar>
      <ContentArea>
        {activeTab === 'findStore' && <FindStore />}
        {activeTab === 'priceComparison' && <PriceComparision />}
        {activeTab === 'discountNews' && <DiscountNews />}
      </ContentArea>
    </MainContainer>
  );
};

export default Home;

const MainContainer = styled.div`
  display: flex;
  height: 100vh;
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
