import { Colors } from "@shared/constants";
import Image from "next/image";
import styled from "styled-components";
import { Menu } from "@shared/types";
import { FindStore, MenuList } from "./FindStore";
import { ComparePrice } from "./ComparePrice";
import { useRecoilState } from "recoil";
import { SelectedMenu } from "@shared/atoms";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SideNavigation = () => {
  const [currentMenu, setCurrentMenu] = useRecoilState(SelectedMenu);
  const { push, pathname } = useRouter();

  const handleCurrentMenu = (value: Menu) => {
    setCurrentMenu(value);
  };

  useEffect(() => {
    if (currentMenu !== "할인 소식" && pathname.includes("info")) {
      push("/");
    }
  }, [currentMenu]);

  return (
    <Container $currentMenu={currentMenu}>
      <LogoContainer>
        <Logo onClick={() => push("/")}>
          <Image src="/images/logo.svg" alt="logo" width={98} height={30} />
        </Logo>
      </LogoContainer>
      <ListContainer>
        <MenuList
          currentMenu={currentMenu}
          handleCurrentMenu={handleCurrentMenu}
        />
        {currentMenu !== "할인 소식" && (
          <DetailContainer>
            <ContentContainer>
              {currentMenu === "알뜰 가게 찾기" && <FindStore />}
              {currentMenu === "시장 가격 비교" && <ComparePrice />}
            </ContentContainer>
          </DetailContainer>
        )}
      </ListContainer>
    </Container>
  );
};

const Container = styled.div<{ $currentMenu: Menu }>`
  ${({ $currentMenu }) => {
    switch ($currentMenu) {
      case "할인 소식":
        return `
          min-width: 138px;
          max-width: 138px;
          border-right: 1px solid ${Colors.Black600};
      `;
      default:
        return `
          min-width: 473px;
          max-width: 473px;
      `;
    }
  }}
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

const Logo = styled.div`
  cursor: pointer;
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
