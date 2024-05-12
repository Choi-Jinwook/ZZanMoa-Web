import { useEffect, useState } from "react";
import styled from 'styled-components';
import { createRoot } from 'react-dom/client';
import { Colors } from '@shared/constants';
import Text from '@shared/components/Text';
import StoreInfoWindow from "./StoreInfoWindow";

const OverlayContainer = styled.div<{ $isActive?: boolean }>`
  position: absolute;
  background-color: ${({ $isActive }) => ($isActive ? `${Colors.Emerald500}` : "white")};
  height: 44px;
  bottom: 10px;
  right: -100px;
  padding: 8px 14px;
  display: flex;
  gap: 10px;
  border: 1px solid #0A6F4D;
  box-shadow: 0px 1px 2px rgba(27, 40, 54, 0.2);
  border-radius: 53px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  z-index: 2;

  &:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 20%;
    width: 0;
    height: 0;
    border-width: 10px 10px 3px 10px; 
    border-style: solid;
    border-color: ${({ $isActive }) => ($isActive ? `${Colors.Emerald500}` : "white")} transparent transparent transparent;
    transform: translateX(-50%);
  }

  &:before {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 20%;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 9px 9px 1px 9px; 
    border-color: #0A6F4D transparent transparent transparent;
    transform: translateX(-50%);
  }
`;

const CustomText = styled(Text) <{ $isActive?: boolean }>`
  color: ${({ $isActive }) => ($isActive ? "white" : `${Colors.Black900}`)};

`

const StoreOverlay = ({ map, position, content, onClose, store }) => {
    const [isActive, setIsActive] = useState(false);
    const [isInfoActive, setIsInfoActive] = useState(false);

    const handleOverlayClick = () => {
        setIsActive(!isActive);
        setIsInfoActive(!isInfoActive);
        console.log("Overlay clicked!");
    };

    useEffect(() => {
        if (!map) return;

        const overlayContent = document.createElement('div');
        overlayContent.style.position = 'relative';
        overlayContent.style.left = '-50%';
        overlayContent.style.transform = 'translate(-50%, -100%)';

        const OverlayNode = () => (
            <OverlayContainer $isActive={isActive} onClick={handleOverlayClick}>
                <img src="/images/MarkerImage.svg" alt="마커 이미지" style={{ width: 24, height: 24 }} />
                <CustomText
                    $isActive={isActive}
                    variant="Body2"
                    fontWeight="SemiBold">
                    {content}
                </CustomText>
                {isInfoActive && (
                <StoreInfoWindow store={store} onClose={() => {
                    setIsInfoActive(false);
                    onClose();
                }} />
            )}
            </OverlayContainer>
        );

        const root = createRoot(overlayContent);
        root.render(<OverlayNode />);

        const customOverlay = new kakao.maps.CustomOverlay({
            map: map,
            position: new kakao.maps.LatLng(position.lat, position.lng),
            content: overlayContent,
            yAnchor: 1
        });

        const handleClick = () => {
            setIsInfoActive(false);
            setIsActive(false);
        };
        kakao.maps.event.addListener(map, 'click', handleClick);

        return () => {
            kakao.maps.event.removeListener(map, 'click', handleClick);
            customOverlay.setMap(null);
            setTimeout(() => root.unmount(), 0);
        };
    }, [map, position, content, isActive, isInfoActive]);

    return null;
};

export default StoreOverlay;
