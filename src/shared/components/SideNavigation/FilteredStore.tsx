import { Colors } from "@shared/constants";
import Image from "next/image";
import styled from "styled-components";
import Text from "../Text";

const FilteredStore = () => {
  const store = [
    {
      src: "/images/sample.png",
      name: "ㅇㅇㅇ 한식당",
      address: "서울시 강남구 강남대로",
      menu: "김치찌개",
      call: "02-000-0000",
    },
    {
      src: "/images/sample.png",
      name: "ㅇㅇㅇ 한식당",
      address: "서울시 강남구 강남대로",
      menu: "김치찌개",
      call: "02-000-0000",
    },
    {
      src: "/images/sample.png",
      name: "ㅇㅇㅇ 한식당",
      address: "서울시 강남구 강남대로",
      menu: "김치찌개",
      call: "02-000-0000",
    },
    {
      src: "/images/sample.png",
      name: "ㅇㅇㅇ 한식당",
      address: "서울시 강남구 강남대로",
      menu: "김치찌개",
      call: "02-000-0000",
    },
    {
      src: "/images/sample.png",
      name: "ㅇㅇㅇ 한식당",
      address: "서울시 강남구 강남대로",
      menu: "김치찌개",
      call: "02-000-0000",
    },
  ];
  return (
    <Container>
      {store.map(({ src, name, address, menu, call }, index) => (
        <StoreCard key={`${src}-${index}`}>
          <Image src={src} alt="image" width={84} height={84} />
          <StoreInfo>
            <Text variant="Body1" color={Colors.Black900}>
              {name}
            </Text>
            <StoreDetail>
              <Text variant="Body4">{`장소 | ${address}`}</Text>
              <Text variant="Body4">{`메뉴 | ${menu}`}</Text>
              <Text variant="Body4">{`번호 | ${call}`}</Text>
            </StoreDetail>
          </StoreInfo>
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
  gap: 14px;
  padding-bottom: 24px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StoreCard = styled.div`
  display: flex;
  width: 100%;
  border: 1px solid ${Colors.Black100};
  border-radius: 4px;
  gap: 16px;
  padding: 16px 8px;
`;

const StoreInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StoreDetail = styled.div`
  display: flex;
  flex-direction: column;
`;

export default FilteredStore;
