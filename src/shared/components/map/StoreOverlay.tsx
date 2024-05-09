import { useEffect } from "react";
import styled from 'styled-components';
import { createRoot } from 'react-dom/client';
import { Colors } from '@shared/constants';
import Text from '@shared/components/Text';

const OverlayContainer = styled.div<{ $isActive?: boolean }>`
  position: absolute;
  background-color: ${({ $isActive }) => ($isActive ? `${Colors.Emerald500}` : "white" )};
  width: 150px;
  height: 44px;
  bottom: 40px;
  right: -70px;
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
`;

const CustomText = styled(Text)<{ $isActive?: boolean}>`
  color: ${({ $isActive }) => $isActive ? "white" : `${Colors.Black900}`};

`

const StoreOverlay = ({ map, position, content, isActive, toggleActive }) => {
    useEffect(() => {
        if (!map) return;

        const overlayContent = document.createElement('div');
        overlayContent.style.position = 'relative';
        overlayContent.style.left = '-50%';
        overlayContent.style.transform = 'translate(-50%, -100%)';

        const OverlayNode = () => (
            <OverlayContainer $isActive={isActive}>
                <img src="/images/MarkerImage.svg" alt="마커 이미지" style={{ width: 24, height: 24 }} />
                <CustomText
                variant="Body2"
                fontWeight="SemiBold">
                {content}
                </CustomText>
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

        return () => {
            customOverlay.setMap(null);
            setTimeout(() => root.unmount(), 0);
        };
    }, [map, position, content, isActive]);

    return null;
};

export default StoreOverlay;
