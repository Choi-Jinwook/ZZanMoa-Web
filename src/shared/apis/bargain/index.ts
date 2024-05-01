import { QueryKey } from "@shared/constants";
import { District, SaleInfo } from "@shared/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetBargainDistrict = () => {
  return useQuery<District[], Error, District[]>(
    [QueryKey.district],
    async () => {
      const res = await axios.get<District[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/bargain-board/get/district`,
      );
      return res.data;
    },
    {
      select: (data) => {
        data.sort((a, b) => a.districtName.localeCompare(b.districtName));
        const newData = [...data];
        newData.unshift({
          districtId: 0,
          districtName: "서울시 전체",
        });

        return newData;
      },
    },
  );
};

export const useGetBargainInfo = (page: number, id?: number) => {
  return useQuery<SaleInfo, Error, SaleInfo>(
    [QueryKey.bargain, page, id],
    async () => {
      const res = await axios.get<SaleInfo>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/bargain-board/`,
        {
          params: { id: id, page: page },
        },
      );

      return res.data;
    },
  );
};
