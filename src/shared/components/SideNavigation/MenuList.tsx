import { Colors } from "@shared/constants";
import { useState } from "react";
import styled from "styled-components";
import Text from "../Text";
import { Menu } from "@shared/types";

const MenuList = () => {
  const [currentMenu, setCurrentMenu] = useState<Menu>("알뜰 가게 찾기");
  const NAV_MENU: Menu[] = ["알뜰 가게 찾기", "시장 가격 비교", "할인 소식"];

  const handleClick = (value: Menu) => {
    setCurrentMenu(value);
  };

  return (
    <ListContainer>
      {NAV_MENU.map((menu) => (
        <TextContainer
          key={menu}
          $focus={currentMenu === menu}
          onClick={() => handleClick(menu)}
        >
          <Text
            variant="Body3"
            color={currentMenu === menu ? Colors.Emerald500 : Colors.Black700}
          >
            {menu}
          </Text>
        </TextContainer>
      ))}
    </ListContainer>
  );
};

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 138px;
  height: 100%;
  border-right: 1px solid ${Colors.Black600};
  align-items: center;
  gap: 24px;
  padding: 30px 0px;
`;

const TextContainer = styled.div<{ $focus: boolean }>`
  padding: 10px 8px;
  border-radius: 4px;
  background-color: ${({ $focus }) =>
    $focus ? Colors.Emerald50 : "transparent"};
`;

export default MenuList;
