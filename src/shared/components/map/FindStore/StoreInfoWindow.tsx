import React from 'react';
import styled from 'styled-components';
import { Colors } from '@shared/constants';
import Text from "../../Text";
import OpenMapLink from '../OpenMapLink';
import { StoreData } from '@shared/types';


const WindowContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 327px;
  position: absolute;
  z-index: 3;
  top: 35px;
  left: -70px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: ${Colors.Black900};
`;

const ItemsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0px 10px 0px;
  `;

const LeftItems = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ItemText = styled(Text)`
  background-color: ${Colors.Emerald50};
  padding: 5px; 
  border-radius: 4px;
`;

const MoreItemsText = styled(Text)`
  background-color: ${Colors.Black100};
  padding: 5px;
  border-radius: 4px;
`;

const RightIcons = styled.div`
  display: flex;
`;

const PriceList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
`;

const PriceItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 4px 0px 0px 16px;
  border-top: 1px solid #B9B9BA;
  &:last-child {
    border-bottom: 1px solid #B9B9BA;
  }
`;

interface StoreInfoWindowProps {
  store: StoreData;
  onClose: () => void;
}

const StoreInfoWindow = ({ store, onClose } : StoreInfoWindowProps) => {
  const displayedItems = store.items.slice(0, 2);
  const moreItemsCount = store.items.length - 2;

  console.log(store.storeName);
  console.log(store.latitude);

  const handleWindowClick = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation();
};
  
  return (
    <WindowContainer id="store-info-window" onClick={handleWindowClick}>
      <CloseButton onClick={onClose}>&times;</CloseButton>
      <Text
        variant='Body1'
        color={Colors.Black900}
        fontWeight="SemiBold">
        {store.storeName}
      </Text>
      <Text
        variant='Body4'
        color={Colors.Black600}
        fontWeight="Regular">
        장소 | {store.address}
      </Text>
      <Text
        variant='Body4'
        color={Colors.Black600}
        fontWeight="Regular">
        번호 | {store.phoneNumber}
      </Text>
      <ItemsContainer>
        <LeftItems>
          {displayedItems.map(item => (
            <ItemText
              variant='Body4'
              color={Colors.Emerald600}
              fontWeight='SemiBold'
              key={item.itemId}>
              {item.item}
            </ItemText>
          ))}
          {moreItemsCount > 0 && (
            <MoreItemsText
              variant='Body4'
              color={Colors.Black800}
              fontWeight='SemiBold'>
              +{moreItemsCount}
            </MoreItemsText>
          )}
        </LeftItems>
        <RightIcons>
            <OpenMapLink
            name={store.storeName}
            latitude={store.latitude}
            longitude={store.longitude}
            >  
            </OpenMapLink>
        </RightIcons>
      </ItemsContainer>

      <PriceList>
        {store.items.map(item => (
          <PriceItem key={item.itemId}>
            <Text
              variant="Body3"
              color={Colors.Black900}
              fontWeight={"Medium"}>
              {item.item}
            </Text>
            <Text
              variant="Body3"
              color={Colors.Black900}
              fontWeight={"Medium"}>
              {item.price}원
            </Text>
          </PriceItem>
        ))}
      </PriceList>

    </WindowContainer>
  );
}

export default StoreInfoWindow;
