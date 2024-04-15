import React from 'react';
import styled from 'styled-components';
import kakaoIcon from '@shared/assets/kakaoMapIcon.png';
import naverIcon from '@shared/assets/naverMapIcon.png';
import mockImg from '@shared/assets/photo.png';
import Image from 'next/image';

interface StyledInfoWindowProps {
    name: string;
    description: string;
}

const InfoWindowContainer = styled.div`
  display: flex;
  background-color: white;
  border-radius: 4px;
  min-width: 295px;
  max-width: 116px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  padding: 8px;
  border: 1px solid #ccc;
  z-index: 1;
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
  color: #2E2E2F;
  font-size: 18px;
  margin: 0 0 5px 0;
`;

const InfoDescription = styled.div`
  color: #5C5C5D;
  font-size: 12px;
  margin-bottom: 10px;
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center; 
  margin-top: 10px;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background-color: #03251A;
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

const StyledInfoWindow: React.FC<StyledInfoWindowProps> = ({ name, description }) => {
    return (
        <InfoWindowContainer>
            <LeftSection>
                <ImgContainer>
                <Image src={mockImg}/>
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
                    <AddButton onClick={() => alert(`${name} 추가하기`)}>
                        추가하기&emsp;+ 
                    </AddButton>
                </ActionsContainer>
            </RightSection>

        </InfoWindowContainer>
    );
};

export default StyledInfoWindow;
