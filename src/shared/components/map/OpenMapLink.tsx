import styled from "styled-components";
import Image from "next/image";

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
  name: string;
  latitude: number;
  longitude: number;
}

interface OpenMapLinkProps {
  name: string;
  latitude: number;
  longitude: number;
}

const openMapLink = ({ type, name, latitude, longitude }: LinkProps) => {
  let link = "";
  if (type === "kakao") {
    link = `https://map.kakao.com/link/to/${name},${latitude},${longitude}`;
  } else if (type === "naver") {
    link = `https://map.naver.com/v5/search/${name}/place/${latitude},${longitude}`;
  }
  window.open(link, "_blank");
};

const OpenMapLink = ({ name, latitude, longitude }: OpenMapLinkProps) => {
  const handleKakaoClick = () => {
    openMapLink({ type: "kakao", name, latitude, longitude });
  };

  const handleNaverClick = () => {
    openMapLink({ type: "naver", name, latitude, longitude });
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
