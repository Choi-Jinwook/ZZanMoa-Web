import Divider from "@shared/components/Divider";
import SectionTitle from "@shared/components/SectionTitle";
import Text from "@shared/components/Text";
import { Colors } from "@shared/constants";
import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";

const ComparePrice = () => {
  const [searchedItem, setSearchedItem] = useState("");
  const [selectedList, setSelectedList] = useState([
    "계란",
    "쌀",
    "우유",
    "샤인머스켓",
    "빵",
    "딸기",
    "삼겹살",
  ]);

  const handleSearch = (value: string) => {
    setSearchedItem(value);
  };

  const addItem = (value: string, key: string) => {
    if (value === "") return;
    if (key === "Enter") setSelectedList((prev) => [...prev, value]);
  };

  const deleteItem = (index: number) => {
    setSelectedList((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Container>
      <SectionTitle
        numbering={1}
        title="시장 선택하기"
        subTitle="지도에서 최소 2개 시장을 선택해주세요"
      />
      <Selection>
        <SelectedMarket />
        <SelectedMarket />
        <SelectedMarket />
        <SelectedMarket />
      </Selection>
      <Divider />
      <ShoppingList>
        <SectionTitle
          numbering={2}
          title="장바구니 담기"
          subTitle="구매할 상품을 장바구니에 담아보세요"
        />
        <SearchBox>
          <Image src="/images/search.svg" alt="search" width={24} height={24} />
          <Search
            value={searchedItem}
            onChange={({ target: { value } }) => handleSearch(value)}
            onKeyUpCapture={({ key }) => addItem(searchedItem, key)}
            placeholder="상품 검색"
          />
        </SearchBox>
        <SelectedList>
          {selectedList?.map((item, index) => {
            return (
              <ItemContainer key={item}>
                <Text variant="Body3" color={Colors.Black900}>
                  {item}
                </Text>
                <ImageContainer onClick={() => deleteItem(index)}>
                  <Image
                    src="/images/delete.svg"
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </ImageContainer>
              </ItemContainer>
            );
          })}
        </SelectedList>
        <SearchButton $isSelected={selectedList.length !== 0}>
          <Text variant="Body2" color="white">
            가격 확인하기
          </Text>
        </SearchButton>
      </ShoppingList>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 24px;
`;

const Selection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SelectedMarket = styled.div`
  width: 100%;
  height: 100px;
  border: 1px dashed ${Colors.Black500};
  border-radius: 4px;
  background-color: ${Colors.Black100};
  background-image: url("/images/plusunion.svg");
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
`;

const ShoppingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SearchBox = styled.div`
  display: flex;
  width: 100%;
  height: 56px;
  padding: 4px 16px;
  border: 2px solid ${Colors.Emerald500};
  border-radius: 4px;
  gap: 8px;
`;

const Search = styled.input`
  width: 100%;
  height: 100%;
  font-size: 16px;
  border: none;
  outline: none;
`;

const SelectedList = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-basis: content;
  width: 100%;
  height: 171px;
  background-color: ${Colors.Black100};
  padding: 12px 9px;
  gap: 12px 8px;
`;

const ItemContainer = styled.div`
  display: flex;
  width: fit-content;
  height: 32px;
  border: 1px solid ${Colors.Emerald500};
  border-radius: 20px;
  background-color: ${Colors.Emerald50};
  align-items: center;
  justify-content: center;
  padding: 4px 8px 4px 16px;
  gap: 7px;
`;

const ImageContainer = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const SearchButton = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 4px;
  color: white;
  background-color: ${({ $isSelected }) =>
    $isSelected ? Colors.Emerald500 : Colors.Black500};
`;

export default ComparePrice;
