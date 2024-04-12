import styled from "styled-components";
import { Colors } from "@shared/constants";
import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import FilteredStore from "./FilteredStore";

const FindStore = () => {
  return (
    <Container>
      <CategoryFilter />
      <Divider />
      <PriceFilter />
      <Divider />
      <FilteredStore />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Divider = styled.div`
  width: 100%;
  border: 1px solid ${Colors.Black100};
`;

export default FindStore;
