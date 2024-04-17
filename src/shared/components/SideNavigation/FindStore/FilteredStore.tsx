import { Colors } from "@shared/constants";
import styled from "styled-components";
import Text from "../../Text";

const FilteredStore = () => {
  const store = [
    {
      name: "가나다라 한식당",
      address: "서울시 강남구 강남대로",
      menu: ["김치찌개", "김치찌개", "김치찌개", "김치찌개"],
      call: "02-000-0000",
    },
    {
      name: "가나다라 한식당",
      address: "서울시 강남구 강남대로",
      menu: ["김치찌개", "김치찌개", "김치찌개", "김치찌개", "김치찌개"],
      call: "02-000-0000",
    },
    {
      name: "가나다라 한식당",
      address: "서울시 강남구 강남대로",
      menu: [
        "김치찌개",
        "김치찌개",
        "김치찌개",
        "김치찌개",
        "김치찌개",
        "김치찌개",
      ],
      call: "02-000-0000",
    },
    {
      name: "가나다라 한식당",
      address: "서울시 강남구 강남대로",
      menu: [
        "김치찌개",
        "김치찌개",
        "김치찌개",
        "김치찌개",
        "김치찌개",
        "김치찌개",
        "김치찌개",
      ],
      call: "02-000-0000",
    },
    {
      name: "가나다라 한식당",
      address: "서울시 강남구 강남대로",
      menu: ["김치찌개", "김치찌개", "김치찌개", "김치찌개", "김치찌개"],
      call: "02-000-0000",
    },
  ];
  return (
    <Container>
      {store.map(({ name, address, menu, call }, index) => (
        <StoreCard key={index}>
          <Text variant="Body1" color={Colors.Black900} fontWeight="SemiBold">
            {name}
          </Text>
          <StoreDetail>
            <Text
              variant="Body4"
              color={Colors.Black800}
            >{`장소 | ${address}`}</Text>
            <Text
              variant="Body4"
              color={Colors.Black800}
            >{`번호 | ${call}`}</Text>
          </StoreDetail>
          <StoreMenu>
            <>
              {(() => {
                const showingMenu = menu.splice(0, 2);
                const remains = menu.length - 2;
                return (
                  <>
                    {showingMenu.map((_menu, _index) => (
                      <Menu key={_menu + _index}>
                        <Text
                          variant="Body4"
                          color={Colors.Emerald600}
                          fontWeight="SemiBold"
                        >
                          {_menu}
                        </Text>
                      </Menu>
                    ))}
                    {remains > 0 && (
                      <Remains key={address + remains}>
                        <Text
                          variant="Body4"
                          color={Colors.Black800}
                          fontWeight="SemiBold"
                        >
                          {`+${remains}`}
                        </Text>
                      </Remains>
                    )}
                  </>
                );
              })()}
            </>
          </StoreMenu>
        </StoreCard>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StoreCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid ${Colors.Black600};
  gap: 8px;
  padding: 16px;
`;

const StoreDetail = styled.div`
  display: flex;
  flex-direction: column;
`;

const StoreMenu = styled.div`
  display: flex;
  gap: 10px;
`;

const Menu = styled.div`
  background-color: ${Colors.Emerald50};
  padding: 4px;
`;

const Remains = styled.div`
  background-color: ${Colors.Black100};
  padding: 4px;
`;

export default FilteredStore;
