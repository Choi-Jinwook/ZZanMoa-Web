import { Colors } from "@shared/constants";
import Image from "next/image";
import styled from "styled-components";
import { useState } from "react";
import { Menu } from "@shared/types";
import { FindStore, MenuList } from "./FindStore";
import { ComparePrice } from "./ComparePrice";

const SideNavigation = () => {
  const [currentMenu, setCurrentMenu] = useState<Menu>("알뜰 가게 찾기");

  const handleCurrentMenu = (value: Menu) => {
    setCurrentMenu(value);
  };

  return (
    <Container>
      <LogoContainer>
        <Image src="/images/logo.svg" alt="logo" width={98} height={30} />
      </LogoContainer>
      <ListContainer>
        <MenuList
          currentMenu={currentMenu}
          handleCurrentMenu={handleCurrentMenu}
        />
        <DetailContainer>
          <ContentContainer>
            {currentMenu === "알뜰 가게 찾기" && <FindStore />}
            {currentMenu === "시장 가격 비교" && <ComparePrice />}
          </ContentContainer>
        </DetailContainer>
      </ListContainer>
    </Container>
  );
};

const Container = styled.div`
  min-width: 473px;
  max-width: 473px;
  height: 100%;
`;

const LogoContainer = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  border-bottom: 1px solid ${Colors.Black600};
  align-items: center;
  gap: 11px;
  padding: 0px 24px;
`;

const ListContainer = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 60px);
  overflow: auto;
`;

const DetailContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export default SideNavigation;
