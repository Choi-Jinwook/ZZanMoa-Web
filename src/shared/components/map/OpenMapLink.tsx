import styled from "styled-components";
import Image from "next/image";
import { useConvertLatLng, useGetCurrentPosition } from "@shared/hooks";

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;

const IconImageWrapper = styled.button`
  margin-right: 8px;
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover,
  &:focus {
    outline: none;
  }
`;

interface LinkProps {
  type: "kakao" | "naver";
  latitude: number;
  longitude: number;
}

interface OpenMapLinkProps {
  name: string;
  latitude: number;
  longitude: number;
  isInfoActive?: boolean;
}


const OpenMapLink = ({
  name,
  latitude,
  longitude,
  isInfoActive,
}: OpenMapLinkProps) => {
  const { currentPosition } = useGetCurrentPosition();
  const { coord: startPoint } = useConvertLatLng(
    currentPosition.lat,
    currentPosition.lng,
    isInfoActive,
  );
  const { coord: endPoint } = useConvertLatLng(
    latitude,
    longitude,
    isInfoActive,
  );

  const openMapLink = ({ type, latitude, longitude }: LinkProps) => {
    let link = "";
    if (type === "kakao") {
      link = `https://map.kakao.com/?map_type=TYPE_MAP&target=car&rt=${startPoint.lng},${startPoint.lat},${endPoint.lng},${endPoint.lat}&rt1=%현위치&rt2=${name}`;
    } else if (type === "naver") {
      link = `http://map.naver.com/index.nhn?slng=${currentPosition.lng}&slat=${currentPosition.lat}&stext=현위치&elng=${longitude}&elat=${latitude}&pathType=0&showMap=true&etext=${name}&menu=route`;
    }
    window.open(link, "_blank");
  };

  const handleKakaoClick = () => {
    openMapLink({ type: "kakao", latitude, longitude });
  };

  const handleNaverClick = () => {
    openMapLink({ type: "naver", latitude, longitude });
  };

  return (
    <IconWrapper>
      <IconImageWrapper onClick={handleKakaoClick}>
        <Image
          src="/images/kakaoMapIcon.svg"
          alt="카카오맵"
          width={24}
          height={24}
        />
      </IconImageWrapper>
      <IconImageWrapper onClick={handleNaverClick}>
        <Image
          src="/images/naverMapIcon.svg"
          alt="네이버맵"
          width={24}
          height={24}
        />
      </IconImageWrapper>
    </IconWrapper>
  );
};

export default OpenMapLink;
