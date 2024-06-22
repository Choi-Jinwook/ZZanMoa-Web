import { Colors } from "@shared/constants";
import styled from "styled-components";
import Text from "../../Text";
import { Menu } from "@shared/types";

interface MenuListProps {
  currentMenu: Menu;
  handleCurrentMenu: (value: Menu) => void;
}

const MenuList = ({ currentMenu, handleCurrentMenu }: MenuListProps) => {
  const NAV_MENU: Menu[] = ["알뜰 가게 찾기", "시장 가격 비교", "할인 소식"];

  return (
    <ListContainer>
      <MenuContainer>
        {NAV_MENU.map((menu) => (
          <MenuWrapper key={menu} $isCurrentMenu={currentMenu === menu}>
            <TextContainer
              $focus={currentMenu === menu}
              onClick={() => handleCurrentMenu(menu)}
            >
              <Text
                variant="Body3"
                color={
                  currentMenu === menu ? Colors.Emerald700 : Colors.Black700
                }
                fontWeight={currentMenu === menu ? "SemiBold" : "Medium"}
              >
                {menu}
              </Text>
            </TextContainer>
          </MenuWrapper>
        ))}
      </MenuContainer>
    </ListContainer>
  );
};

const ListContainer = styled.ul`
  min-width: 148px;
  height: 100%;
  border-right: 1px solid ${Colors.Black600};
  padding: 16px 0px;
  margin: 0;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const MenuWrapper = styled.li<{ $isCurrentMenu: boolean }>`
  padding: 0px 18px;
  ${({ $isCurrentMenu }) =>
    $isCurrentMenu && `border-left: 3px solid ${Colors.Emerald600};`}
  cursor: pointer;
`;

const TextContainer = styled.div<{ $focus: boolean }>`
  padding: 10px 8px;
  border-radius: 4px;
  background-color: ${({ $focus }) =>
    $focus ? Colors.Emerald50 : "transparent"};
  text-align: center;
`;

export default MenuList;
