export const convertCategoryId = (value: string) => {
  switch (value) {
    case "전체":
      return 0;
    case "할인 소식":
      return 1;
    case "직거래 마켓":
      return 2;
    default:
      return 0;
  }
};
