import { markersState } from "@shared/atoms/MapState";
import selectedMarketsState from "@shared/atoms/MarketState";
import Text from "@shared/components/Text";
import { Colors } from "@shared/constants";
import { MarkerInfo } from "@shared/types";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";

const MarketCard = () => {
  const [selectedMarkets, setSelectedMarkets] =
    useRecoilState<MarkerInfo[]>(selectedMarketsState);
    const setMarkers = useSetRecoilState(markersState);

    const handleDelete = (index: number) => {
      const markerToDelete = selectedMarkets[index];
  
      setSelectedMarkets(prev => prev.filter((_, i) => i !== index));
  
      setMarkers(prev => prev.map(marker => {
          if (marker.id === markerToDelete.id) {
              return { ...marker, added: false };
          }
          return marker;
      }));
  };
  
  

  useEffect(() => {
    console.log('Selected Markets updated:', selectedMarkets);
}, [selectedMarkets]);

  return (
    <>
      {selectedMarkets.map(({ name, address }, index) => (
        <SelectedMarket key={address}>
          {/* {src && <Image src={src} alt={src} width={84} height={84} />} */}
          <MarketInfo>
            <MarketInfoWrapper>
              <Text
                variant="Body1"
                color={Colors.Black900}
                fontWeight="SemiBold"
              >
                {name}
              </Text>
              <Text
                variant="Body4"
                color={Colors.Black800}
                fontWeight="Regular"  
              >
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
      <>
        {selectedMarkets.length < 4 &&
          Array.from({ length: 4 - selectedMarkets.length }, (_, _index) => (
            <BlankBox key={_index} />
          ))}
      </>
    </>
  );
};

const BlankBox = styled.div`
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

const SelectedMarket = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
  border: 1px solid ${Colors.Black500};
  border-radius: 4px;
  padding: 8px;
  gap: 16px;
`;

const MarketInfo = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const MarketInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const DeleteButton = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

export default MarketCard;
