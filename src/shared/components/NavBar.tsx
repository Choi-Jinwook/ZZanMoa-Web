import React from "react"
import styled from "styled-components";

type Props = {
    onTabChange: (tabName: string) => void;
};

const NavBar = styled.nav`
  display: fixed;

`

export const Navigation: React.FC<Props> = ({ onTabChange }) => {
    return (
        <NavBar>
            <button onClick={() => onTabChange('findStore')}>알뜰가게찾기</button>
            <button onClick={() => onTabChange('priceComparison')}>시장가격비교</button>
            <button onClick={() => onTabChange('discountNews')}>할인 소식</button>
        </NavBar>
    )
}
