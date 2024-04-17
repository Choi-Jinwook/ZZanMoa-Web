import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import kakaoIcon from '@shared/assets/kakaoMapIcon.png';
import naverIcon from '@shared/assets/naverMapIcon.png';
import mockImg from '@shared/assets/photo.png';
import Image from 'next/image';
import { Colors } from '@shared/constants';
import { MarkerInfo } from '@shared/types';

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
}))<AddButtonProps>`
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

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;

const IconImageWrapper = styled.div`
  margin-right: 8px;
`;

interface StyledInfoWindowProps extends Partial<MarkerInfo> {
  onToggleAdded: () => void;
  overlayRef: React.RefObject<kakao.maps.CustomOverlay>;
}

interface AddButtonProps {
  added: boolean;
}

const StyledInfoWindow: React.FC<StyledInfoWindowProps> = ({ name, description, added, onToggleAdded, overlayRef }) => {
  const addedMarkers = JSON.parse(localStorage.getItem('addedMarkers') || '[]');
  const [localAdded, setLocalAdded] = useState(added);


  useEffect(() => {
    if (overlayRef && overlayRef.current) {
      const content = overlayRef.current.getContent();
      if (content instanceof HTMLElement) {
        content.style.display = localAdded ? 'block' : 'none';
      }
    }
  }, [localAdded, overlayRef]);
  

  const handleButtonClick = () => {
    onToggleAdded();
    setLocalAdded(current => !current);
  };

  return (
    <InfoWindowContainer>
      <LeftSection>
        <ImgContainer>
          <Image src={mockImg} />
        </ImgContainer>
      </LeftSection>
      <RightSection>
        <InfoTitle>{name}</InfoTitle>
        <InfoDescription>{description}</InfoDescription>
        <ActionsContainer>
          <IconWrapper>
            <IconImageWrapper>
              <Image src={kakaoIcon} alt="카카오맵" width={24} height={24} />
            </IconImageWrapper>
            <IconImageWrapper>
              <Image src={naverIcon} alt="네이버맵" width={24} height={24} />
            </IconImageWrapper>
          </IconWrapper>
          <AddButton onClick={handleButtonClick} added={localAdded!}>
            {localAdded ? '삭제하기' : '추가하기'}&emsp;{localAdded ? 'x' : '+'}
          </AddButton>
        </ActionsContainer>
      </RightSection>

    </InfoWindowContainer>
  );
};

export default StyledInfoWindow;
