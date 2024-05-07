export const convertCategoryId = (value: string) => {
  switch (value) {
    case "할인 소식":
      return 1;
    case "직거래 마켓":
      return 2;
    case "물가정보":
      return 3;
    default:
      return 1;
  }
};
