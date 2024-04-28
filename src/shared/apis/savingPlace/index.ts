import { QueryKey, categoryOrder } from "@shared/constants";
import { StoreCategory, StoreData } from "@shared/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const getStoreApi = async () => {
  const res = await axios.get<StoreData[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/saving-place/get/store`,
  );

  return res.data;
};

export const useGetCategory = () => {
  return useQuery<StoreCategory[], Error, StoreCategory[]>(
    [QueryKey.category],
    async () => {
      const res = await axios.get<StoreCategory[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/saving-place/get/category`,
      );

      return res.data;
    },
    {
      select: (data: StoreCategory[]) => {
        data.sort((a, b) => {
          return (
            categoryOrder.indexOf(a.category) -
            categoryOrder.indexOf(b.category)
          );
        });

        return data;
      },
    },
  );
};
