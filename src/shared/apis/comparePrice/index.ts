import { QueryKey } from "@shared/constants";
import { MarketItem } from "@shared/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetMarketItems = () => {
  return useQuery<MarketItem[], Error, MarketItem[]>(
    [QueryKey.itemSave],
    async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/market/item/get`,
      );

      return res.data;
    },
  );
};
