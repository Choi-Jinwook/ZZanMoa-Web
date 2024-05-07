import Divider from "@shared/components/Divider";
import SectionTitle from "@shared/components/SectionTitle";
import Text from "@shared/components/Text";
import { Colors } from "@shared/constants";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import MarketCard from "./MarketCard";
import { useGetMarketItems } from "@shared/apis";
import selectedMarketsState from "@shared/atoms/MarketState";
import { useRecoilState } from "recoil";
import axios from "axios";
import { useRouter } from "next/router";
import { rank } from "@shared/atoms";

const ComparePrice = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [searchedItem, setSearchedItem] = useState("");
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMarkets] = useRecoilState(selectedMarketsState);
  const [, setRank] = useRecoilState(rank);
  const { push } = useRouter();
  const { data: items } = useGetMarketItems();

  const handleSearch = (value: string) => {
    setSearchedItem(value);
  };

  const handleAddItem = (value: string) => {
    if (value === "") return;
    setSelectedList((prev) => {
      if (prev) {
        return [...prev, value];
      }

      return [value];
    });
    setSearchedItem("");
  };

  const handleDeleteItem = (index: number) => {
    setSelectedList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCompare = async () => {
    try {
      const marketNames = selectedMarkets.map(({ name }) => {
        return name;
      });
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/market/compare`,
        {
          marketNames: marketNames,
          itemNames: selectedList,
        },
      );

      if (res.status === 200) {
        setRank(res.data);
        push(`/compare`);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    const handleInputFocus = (e: any) => {
      if (document.activeElement !== inputRef.current) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    window.addEventListener("click", (e) => handleInputFocus(e));

    return () => {
      window.removeEventListener("click", (e) => handleInputFocus(e));
    };
  }, []);

  return (
    <Container>
      <SectionTitle
        numbering={1}
        title="시장 선택하기"
        subTitle="지도에서 최소 2개 시장을 선택해주세요"
      />
      <Selection>
        <MarketCard />
      </Selection>
      <Divider />
      <ShoppingList>
        <SectionTitle
          numbering={2}
          title="장바구니 담기"
          subTitle="구매할 상품을 장바구니에 담아보세요"
        />
        <SearchBox ref={searchRef}>
          <Image src="/images/search.svg" alt="search" width={24} height={24} />
          <Search
            ref={inputRef}
            value={searchedItem}
            onChange={({ target: { value } }) => handleSearch(value)}
            placeholder="상품 검색"
          />
          {isOpen && (
            <AutoCompleteContainer>
              {items
                ?.filter(({ itemName }) =>
                  searchedItem ? itemName.includes(searchedItem) : true,
                )
                .map(({ itemId, itemName }, index, array) => {
                  const parts = itemName.split(
                    new RegExp(`(${searchedItem})`, "gi"),
                  );

                  return (
                    <AutoCompleteItem
                      key={itemId}
                      $isLast={index === array.length - 1}
                      onClick={() => handleAddItem(itemName)}
                    >
                      {parts.map((part, index) => (
                        <Text
                          variant="Body2"
                          color={Colors.Black900}
                          fontWeight="Bold"
                          key={part + index}
                          className={
                            part.toLowerCase() === searchedItem.toLowerCase()
                              ? "highlight"
                              : ""
                          }
                        >
                          {part}
                        </Text>
                      ))}
                    </AutoCompleteItem>
                  );
                })}
            </AutoCompleteContainer>
          )}
        </SearchBox>
        <SelectedList>
          {selectedList?.map((item, index) => {
            return (
              <ItemContainer key={item}>
                <Text variant="Body3" color={Colors.Black900}>
                  {item}
                </Text>
                <ImageContainer onClick={() => handleDeleteItem(index)}>
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
        <SearchButton
          $isSelected={selectedList.length !== 0 && selectedMarkets.length > 1}
          onClick={handleCompare}
        >
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

const ShoppingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SearchBox = styled.div`
  display: flex;
  position: relative;
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

const AutoCompleteContainer = styled.div`
  position: absolute;
  top: 72px;
  left: 0px;
  width: 100%;
  min-height: 50px;
  max-height: 240px;
  box-shadow: 0px 0px 8px 0px rgba(212, 157, 157, 0.75);
  border: 1px solid white;
  border-radius: 4px;
  background-color: white;
  overflow: auto;
  z-index: 5;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const AutoCompleteItem = styled.div<{ $isLast?: boolean }>`
  display: flex;
  padding: 12px 16px;
  ${({ $isLast }) => {
    if (!$isLast) {
      return `
        border-bottom: 1px solid ${Colors.Black600};  
      `;
    }
  }}
  cursor: pointer;

  p.highlight {
    color: ${Colors.Emerald600};
    font-weight: bold;
  }
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
  cursor: pointer;
`;

export default ComparePrice;
