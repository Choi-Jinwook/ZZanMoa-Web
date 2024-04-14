import { Colors } from "@shared/constants";
import Image from "next/image";
import styled from "styled-components";
import Text from "../Text";
import MenuList from "./MenuList";
import FindStore from "./FindStore";

const SideNavigation = () => {
  return (
    <Container>
      <LogoContainer>
        <Image src="/images/logo.svg" alt="logo" width={30} height={30} />
        <Text variant="H4" color={Colors.Black900}>
          짠모아
        </Text>
      </LogoContainer>
      <ListContainer>
        <MenuList />
        <DetailContainer>
          <FindStore />
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
`;

const DetailContainer = styled.div`
  width: calc(100% - 138px);
  height: 100%;
  padding: 30px 15px;
`;

export default SideNavigation;
