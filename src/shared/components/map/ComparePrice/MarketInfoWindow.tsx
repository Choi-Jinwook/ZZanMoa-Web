import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { Colors } from '@shared/constants';
import Text from "@shared/components/Text";

const InfoWindowContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 4px;
  min-width: 195px;
  max-width: 116px;
  padding: 8px;
  z-index: 3;
  border: none;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 8px 16px rgba(0, 0, 0, 0.14);
  gap: 8px;
`;

const Section = styled.div`

`

const ActionsContainer = styled.div`
  display: flex;
  align-items: center; 
  margin-top: 10px;
`;

const AddButton = styled.button.attrs(props => ({
})) <AddButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background-color: ${props => props.added ? Colors.Emerald900 : Colors.Emerald500};
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  width: auto;
  &:hover {
    background-color: #333;
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;

export const IconImageWrapper = styled.div`
  margin-right: 8px;
`;

interface MarketInfoWindowProps {
  name: string;
  address: string;
  id: number;
  overlayRef: React.RefObject<kakao.maps.CustomOverlay>;
  onToggleAdded: () => void;
  added: boolean
}

interface AddButtonProps {
  added: boolean;
}

const MarketInfoWindow: React.FC<MarketInfoWindowProps> = ({ name, address, id, overlayRef, onToggleAdded, added }) => {
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(added);
  }, [added]);

  const handleButtonClick = () => {
    const addedMarkers = JSON.parse(localStorage.getItem("addedMarkers") || "[]");

    if (!isSelected && addedMarkers.length >= 4) {
      alert('최대 4개의 시장만 추가할 수 있습니다.');
      return;
    } else {
      setIsSelected(!isSelected);
      onToggleAdded();
    }
  };

  useEffect(() => {
    if (overlayRef && overlayRef.current) {
      const content = overlayRef.current.getContent();
      if (content instanceof HTMLElement) {
        content.style.display = isSelected ? 'block' : 'none';
      }
    }
  }, [isSelected, overlayRef]);

  return (
    <InfoWindowContainer>
      <Section>
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
        <ActionsContainer>
          <IconWrapper>
            <IconImageWrapper>
              <Image src="/images/kakaoMapIcon.svg" alt="카카오맵" width={24} height={24} />
            </IconImageWrapper>
            <IconImageWrapper>
              <Image src="/images/naverMapIcon.svg" alt="네이버맵" width={24} height={24} />
            </IconImageWrapper>
          </IconWrapper>
          <AddButton onClick={handleButtonClick} added={isSelected}>
            {isSelected ? '삭제하기' : '추가하기'}&emsp;{isSelected ? 'x' : '+'}
          </AddButton>
        </ActionsContainer>
      </Section>
    </InfoWindowContainer>
  );
};

export default MarketInfoWindow;
