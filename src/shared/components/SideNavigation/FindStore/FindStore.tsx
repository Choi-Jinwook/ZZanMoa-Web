import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import FilteredStore from "./FilteredStore";
import Divider from "@shared/components/Divider";
import styled from "styled-components";
import { Colors } from "@shared/constants";

const FindStore = () => {
  return (
    <>
      <Container>
        <ContentContainer>
          <CategoryFilter />
          <Divider />
          <PriceFilter />
        </ContentContainer>
      </Container>
      <FilteredStore />
    </>
  );
};

const Container = styled.div`
  padding: 16px 17px 24px 17px;
  background-color: ${Colors.Black100};
  border-bottom: 1px solid ${Colors.Black600};
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export default FindStore;
