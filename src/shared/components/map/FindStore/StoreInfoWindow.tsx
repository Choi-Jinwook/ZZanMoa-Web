import React from "react";
import styled from "styled-components";
import { Colors } from "@shared/constants";
import Text from "../../Text";
import OpenMapLink from "../OpenMapLink";
import { StoreData } from "@shared/types";

const WindowContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 16px;
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
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 5px;
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

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0px 10px 0px;
`;

export const ReviewButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: ${Colors.Black900};
  border: 1px solid ${Colors.Black600};
  border-radius: 16px;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #f0f0f0;
  }
  img {
    margin-right: 8px;
  }
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
  border-top: 1px solid #b9b9ba;
  &:last-child {
    border-bottom: 1px solid #b9b9ba;
  }
`;

interface StoreInfoWindowProps {
  store: StoreData;
  onClose: () => void;
  onShowReviews: (storeId: number, storeName: string) => void;
  isInfoActive: boolean;
}

const StoreInfoWindow = ({
  store,
  onClose,
  onShowReviews,
  isInfoActive,
}: StoreInfoWindowProps) => {
  const displayedItems = store.items.slice(0, 2);
  const moreItemsCount = store.items.length - 2;

  const handleWindowClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
  };

  const handleShowReviewsClick = () => {
    const storeId = parseInt(store.storeId, 10);
    if (!isNaN(storeId)) {
      console.log("!!", storeId, store.storeName);
      onShowReviews(storeId, store.storeName);
    } else {
      console.error("Invalid store ID");
    }
  };

  return (
    <WindowContainer id="store-info-window" onClick={handleWindowClick}>
      <CloseButton onClick={onClose}>&times;</CloseButton>
      <Text variant="Body1" color={Colors.Black900} fontWeight="SemiBold">
        {store.storeName}
      </Text>
      <Text variant="Body4" color={Colors.Black600} fontWeight="Regular">
        장소 | {store.address}
      </Text>
      <Text variant="Body4" color={Colors.Black600} fontWeight="Regular">
        번호 | {store.phoneNumber}
      </Text>
      <ItemsContainer>
        {displayedItems.map((item) => (
          <ItemText
            variant="Body4"
            color={Colors.Emerald600}
            fontWeight="SemiBold"
            key={item.itemId}
          >
            {item.item}
          </ItemText>
        ))}
        {moreItemsCount > 0 && (
          <MoreItemsText
            variant="Body4"
            color={Colors.Black800}
            fontWeight="SemiBold"
          >
            +{moreItemsCount}
          </MoreItemsText>
        )}
      </ItemsContainer>
      <ActionsContainer>
        <ReviewButton onClick={handleShowReviewsClick}>
          <img
            src="/images/aiReviewIcon.svg"
            alt="리뷰 아이콘"
            style={{ width: 16, height: 16 }}
          />
          <Text variant="Body4" color={Colors.Black900} fontWeight="SemiBold">
            AI 리뷰
          </Text>
        </ReviewButton>
        <OpenMapLink
          name={store.storeName}
          latitude={store.latitude}
          longitude={store.longitude}
          isInfoActive={isInfoActive}
        />
      </ActionsContainer>
      <PriceList>
        {store.items.map((item) => (
          <PriceItem key={item.itemId}>
            <Text variant="Body3" color={Colors.Black900} fontWeight={"Medium"}>
              {item.item}
            </Text>
            <Text variant="Body3" color={Colors.Black900} fontWeight={"Medium"}>
              {item.price}원
            </Text>
          </PriceItem>
        ))}
      </PriceList>
    </WindowContainer>
  );
};

export default StoreInfoWindow;
