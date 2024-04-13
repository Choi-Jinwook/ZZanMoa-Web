import { KakaoMap } from "@shared/components/map";
import { useState } from "react";
import styled from "styled-components";


export const PriceComparision: React.FC = () => {
    const center = { lat: 37.554722, lng: 126.970833 };
    const [map, setMap] = useState<kakao.maps.Map | null>(null);

    return (
        <div>
        <KakaoMap center={center} />
        <div>시장 선택 화면</div>
        <div>장바구니 화면</div>
      </div>
    );
};

