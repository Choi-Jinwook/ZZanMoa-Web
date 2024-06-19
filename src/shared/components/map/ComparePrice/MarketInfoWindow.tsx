import React, { useState, useEffect, useRef } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Colors } from "@shared/constants";
import Text from "@shared/components/Text";
import OpenMapLink from "../OpenMapLink";
import { ReviewButton } from "../FindStore/StoreInfoWindow";

const InfoWindowContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 16px;
  width: 327px;
  padding: 16px;
  z-index: 3;
  border: none;
  box-shadow:
    0px 4px 4px rgba(0, 0, 0, 0.25),
    0px 8px 16px rgba(0, 0, 0, 0.14);
`;

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Divider = styled.hr`
  width: 100%;
  border: 0;
  border-top: 1px solid ${Colors.Black600};
  margin: 8px 0;
`;

const AddButton = styled.button.attrs((props) => ({}))<AddButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background-color: ${(props) =>
    props.added ? Colors.Emerald900 : Colors.Emerald500};
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  width: 91px;
  &:hover {
    background-color: #333;
  }
  margin: 10px 0;
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

interface MarketInfoWindowProps {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  overlayRef: React.RefObject<kakao.maps.CustomOverlay>;
  onToggleAdded: () => void;
  added: boolean;
  onShowReviews: (id: number, name: string) => void;
}

interface AddButtonProps {
  added: boolean;
}

const MarketInfoWindow = ({
  id,
  name,
  address,
  latitude,
  longitude,
  overlayRef,
  onToggleAdded,
  added,
  onShowReviews,
}: MarketInfoWindowProps) => {
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(added);
  }, [added]);

  const handleButtonClick = () => {
    const addedMarkers = JSON.parse(
      localStorage.getItem("addedMarkers") || "[]",
    );

    if (!isSelected && addedMarkers.length >= 4) {
      alert("최대 4개의 시장만 추가할 수 있습니다.");
      return;
    } else {
      setIsSelected(!isSelected);
      onToggleAdded();
    }
  };

  const handleShowReviewsClick = () => {
    console.log("ID:", id, "이름:", name);
    onShowReviews(id, name);
  };

  useEffect(() => {
    if (overlayRef && overlayRef.current) {
      const content = overlayRef.current.getContent();
      if (content instanceof HTMLElement) {
        content.style.display = isSelected ? "block" : "none";
      }
    }
  }, [isSelected, overlayRef]);

  return (
    <InfoWindowContainer>
      <Section>
        <Text variant="Body1" color={Colors.Black900} fontWeight="SemiBold">
          {name}
        </Text>
        <Text variant="Body4" color={Colors.Black800} fontWeight="Regular">
          장소 | {address}
        </Text>
        <AddButton onClick={handleButtonClick} added={isSelected}>
          {isSelected ? "삭제하기" : "추가하기"}&emsp;{isSelected ? "x" : "+"}
        </AddButton>
        <Divider />
        <BottomContainer>
          <ReviewButton onClick={handleShowReviewsClick}>
            <img
              src="/images/aiReviewIcon.svg"
              alt="리뷰 아이콘"
              style={{ width: 16, height: 16, marginRight: "8px" }}
            />
            <Text variant="Body4" color={Colors.Black900} fontWeight="SemiBold">
              AI 리뷰
            </Text>
          </ReviewButton>
          <OpenMapLink name={name} latitude={latitude} longitude={longitude} />
        </BottomContainer>
      </Section>
    </InfoWindowContainer>
  );
};

export default MarketInfoWindow;
