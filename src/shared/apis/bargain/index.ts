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

export const useGetBargainInfo = (
  page: number,
  eventId?: number,
  districtId?: number,
  keyword?: string,
) => {
  return useQuery<SaleInfo, Error, SaleInfo>(
    [QueryKey.bargain, page, eventId, districtId, keyword],
    async () => {
      const res = await axios.get<SaleInfo>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/bargain-board/`,
        {
          params: {
            eventId: eventId,
            page: page,
            districtId: districtId,
            keyword: keyword,
          },
        },
      );

      return res.data;
    },
  );
};

export const postSubscription = async (
  email: string,
  selectedDistrict: string[],
) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/subscription`,
    {
      email: email,
      district: selectedDistrict,
    },
  );

  return res;
};

export const postSubscriptionCancel = async (email: string) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/subscription/cancel`,
    {
      email: email,
    },
  );

  return res;
};
