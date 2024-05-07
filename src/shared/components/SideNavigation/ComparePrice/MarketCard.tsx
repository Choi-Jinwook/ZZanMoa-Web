import selectedMarketsState from "@shared/atoms/MarketState";
import Text from "@shared/components/Text";
import { Colors } from "@shared/constants";
import { MarkerInfo } from "@shared/types";
import Image from "next/image";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";

const MarketCard = () => {
  const [selectedMarkets, setSelectedMarkets] =
    useRecoilState<MarkerInfo[]>(selectedMarketsState);

  const handleDelete = (index: number) => {
    setSelectedMarkets((prev) => prev.filter((_, i) => index !== i));
  };

  return (
    <>
      {selectedMarkets.map(({ name, address }, index) => (
        <SelectedMarket key={address}>
          <MarketInfo>
            <MarketInfoWrapper>
              <Text
                variant="Body1"
                color={Colors.Black900}
                fontWeight="SemiBold"
              >
                {name}
              </Text>
              <Text variant="Body4" color={Colors.Black800}>
                {address}
              </Text>
            </MarketInfoWrapper>
            <DeleteButton onClick={() => handleDelete(index)}>
              <Image
                src="/images/deleteMarket.svg"
                alt="delete"
                width={24}
                height={24}
              />
            </DeleteButton>
          </MarketInfo>
        </SelectedMarket>
      ))}
      {selectedMarkets.length < 4 &&
        Array.from({ length: 4 - selectedMarkets.length }, (_, _index) => (
          <BlankBox key={_index} />
        ))}
    </>
  );
};

const BlankBox = styled.div`
  width: 100%;
  height: 80px;
  border: 1px dashed ${Colors.Black500};
  border-radius: 4px;
  background-color: ${Colors.Black100};
  background-image: url("/images/plusunion.svg");
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
`;

const SelectedMarket = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
  border: 1px solid ${Colors.Black500};
  border-radius: 4px;
  padding: 16px;
  gap: 16px;
`;

const MarketInfo = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const MarketInfoWrapper = styled.div``;

const DeleteButton = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

export default MarketCard;
