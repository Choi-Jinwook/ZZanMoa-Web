import { Colors, QueryKey } from "@shared/constants";
import styled from "styled-components";
import Text from "../../Text";
import { StoreData } from "@shared/types";
import { useRecoilState, useSetRecoilState } from "recoil";
import { CurrentPrice, SelectedCategory } from "@shared/atoms";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { storeMarkerState } from "@shared/atoms/storeMarkerState";
import { useEffect } from "react";

const FilteredStore = () => {
  const { data: storeData } = useQuery([QueryKey.store], async () => {
    const res = await axios.get<StoreData[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/saving-place/get/store`,
    );

    return res.data;
  });
  const [currentCategory] = useRecoilState(SelectedCategory);
  const [currentPrice] = useRecoilState(CurrentPrice);
  const setStoreMarkers = useSetRecoilState(storeMarkerState);


  useEffect(() => {
    if (currentCategory) {
      const filteredStores = storeData?.filter(store => 
        store.items.some(item => 
          item.category.includes(currentCategory) &&
          item.price >= currentPrice.minPrice &&
          item.price <= currentPrice.maxPrice
        )
      ) || [];
      
      setStoreMarkers(filteredStores);
      console.log(filteredStores.length);
      
    } 
    // else {
    //   setStoreMarkers([]);
    // }
  }, [storeData, currentCategory, currentPrice, setStoreMarkers]);

  // const filteredStores = getFilteredStores(storeData || []);
  // console.log(filteredStores);

  return (
    <Container>
      {storeData && storeData.map(({ storeId, storeName, address, items, phoneNumber }) => (
        <StoreCard key={storeId}>
          <Text variant="Body1" color={Colors.Black900} fontWeight="SemiBold">{storeName}</Text>
          <StoreDetail>
            <Text variant="Body4" color={Colors.Black800}>{`장소 | ${address}`}</Text>
            <Text variant="Body4" color={Colors.Black800}>{`번호 | ${phoneNumber}`}</Text>
          </StoreDetail>
          <StoreMenu>
            {items.slice(0, 2).map(({ item, itemId, price }) => (
              <Menu key={itemId + price}>
                <Text variant="Body4" color={Colors.Emerald600} fontWeight="SemiBold">{item}</Text>
              </Menu>
            ))}
            {items.length > 2 && (
              <Remains>{`+${items.length - 2} more`}</Remains>
            )}
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
