import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import mockImg from '@shared/assets/photo.png';
import Image from 'next/image';
import { Colors } from '@shared/constants';

const InfoWindowContainer = styled.div`
  display: flex;
  background-color: white;
  border-radius: 4px;
  min-width: 295px;
  max-width: 116px;
  padding: 8px;
  border: 1px solid #ccc;
  z-index: 3;
`;

const LeftSection = styled.div`
  margin-right: 10px;
`

const ImgContainer = styled.div`
  width: 86px;
  height: 86px;
`

const RightSection = styled.div`

`

const InfoTitle = styled.h1`
  color: ${Colors.Black900};
  font-size: 18px;
  margin: 0 0 5px 0;
`;

const InfoDescription = styled.div`
  color: ${Colors.Black800};
  font-size: 12px;
  margin-bottom: 10px;
`;

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

interface StyledInfoWindowProps {
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


const StyledInfoWindow: React.FC<StyledInfoWindowProps> = ({ name, address, id, overlayRef, onToggleAdded, added }) => {
  // const [selectedMarkets, setSelectedMarkets] = useRecoilState(selectedMarketsState);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(added);
  }, [added]);

  const handleButtonClick = () => {
    setIsSelected(!isSelected);
    onToggleAdded();
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
      <LeftSection>
        <ImgContainer>
          <Image src={mockImg} />
        </ImgContainer>
      </LeftSection>
      <RightSection>
        <InfoTitle>{name}</InfoTitle>
        <InfoDescription>{address}</InfoDescription>
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
      </RightSection>

    </InfoWindowContainer>
  );
};

export default StyledInfoWindow;
