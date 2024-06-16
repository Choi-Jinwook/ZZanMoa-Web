import { useEffect, useRef, useState } from "react";
import styled from 'styled-components';
import { createRoot } from 'react-dom/client';
import { Colors } from '@shared/constants';
import Text from '@shared/components/Text';
import StoreInfoWindow from "./StoreInfoWindow";
import { MarkerFindStoreProps } from "./Marker_FindStore";
import ReviewModal from "../ReviewModal";

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
  box-sizing: border-box;
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

const InfoContainer = styled.div`
  position: absolute;
  
`

export interface StoreOverlayProps extends MarkerFindStoreProps {
    onClose: () => void;
}

const StoreOverlay = ({ map, position, content, onClose, store }: StoreOverlayProps) => {
    const [isActive, setIsActive] = useState(false);
    const [isInfoActive, setIsInfoActive] = useState(false);
    const [reviews, setReviews] = useState<string[] | undefined>(undefined);
    const [storeName, setStoreName] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const overlayRef = useRef<HTMLDivElement | null>(null);


    const handleOverlayClick = () => {
        setIsActive(!isActive);
        setIsInfoActive(!isInfoActive);
    };

    const fetchAIReviews = async (storeId: number): Promise<string[]> => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve([
             "홍익분식은 서울 마포구 연남동에 위치한 작은 분식집으로, 다양한 분식 메뉴를 저렴한 가격에 즐길 수 있는 곳입니다. 이 가게는 특히 학생들과 인근 주민들에게 인기가 많으며, 떡볶이, 순대, 튀김 등 다양한 메뉴를 제공합니다.",
             "홍익분식의 떡볶이는 특히 인기 있으며, 떡볶이 국물에 튀김을 찍어 먹는 것도 추천할 만합니다. 또한, 김밥과 라면도 함께 즐길 수 있어 다양한 분식 조합을 시도해볼 수 있습니다",
             "가게는 크지 않지만 아늑한 분위기를 가지고 있으며, 친절한 서비스로 많은 단골 손님을 보유하고 있습니다. 홍익분식은 성미산로 99에 위치해 있으며, 영업시간은 11:30부터 20:00까지입니다. 주차는 불가능하지만, 포장 서비스를 제공하고 있어 편리하게 이용할 수 있습니다"
            ]);
          }, 2000);
        });
      };

      const handleShowReviews = async (storeId: number, storeName: string) => {
        console.log(storeId, storeName);
        
        setIsModalOpen(true);
        setReviews(undefined);
        setStoreName(storeName);

        const reviews = await fetchAIReviews(storeId);
        setReviews(reviews);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setReviews(undefined);
    };

    useEffect(() => {
        if (!map) return;

        const overlayContent = document.createElement('div');
        overlayContent.style.position = 'relative';
        overlayContent.style.left = '-50%';
        overlayContent.style.transform = 'translate(-50%, -100%)';
        overlayRef.current = overlayContent;

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
                    <InfoContainer onClick={(e) => e.stopPropagation()}>
                        <StoreInfoWindow store={store} onClose={() => {
                            setIsInfoActive(false);
                            onClose();
                        }}
                        onShowReviews={handleShowReviews}
                        />
                    </InfoContainer>
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

        const handleClickOutside = () => {
            if (!overlayContent.contains((event as MouseEvent).target as Node)) {
                setIsInfoActive(false);
                setIsActive(false);
            }
        };

        kakao.maps.event.addListener(map, 'click', handleClickOutside);
        

        return () => {
            kakao.maps.event.removeListener(map, 'click', handleClickOutside);
            customOverlay.setMap(null);
            setTimeout(() => root.unmount(), 0);
        };
    }, [map, position, content, isActive, isInfoActive]);

    return(
        <>
            {isModalOpen && <ReviewModal reviews={reviews} storeName={storeName} onClose={handleCloseModal} />}
    </>
    )
};

export default StoreOverlay;