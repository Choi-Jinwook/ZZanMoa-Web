import { StoreCategory, StoreItems } from "@shared/types";

export const convertCategory = (category?: StoreCategory[]) => {
  const categoriesWithEmojis: string[] = [];
  const addedCategories: string[] = [];
  let emoji = "";

  category?.forEach(({ category }) => {
    console.log(category);

    switch (category) {
      case "한식":
        emoji = "🍚";
        break;
      case "중식":
        emoji = "🍜";
        break;
      case "경양식":
        emoji = "🍝";
        break;
      case "일식":
        emoji = "🍣";
        break;
      case "다방업":
        emoji = "☕";
        break;
      case "기타음식업":
        emoji = "🍴";
        break;
      case "미용/이용업":
        emoji = "💈";
        break;
      case "세탁업":
        emoji = "👕";
        break;
      case "영화관람업":
        emoji = "🎬";
        break;
      case "숙박업":
        emoji = "🛏️";
        break;
      case "목욕업":
        emoji = "🛀";
        break;
      default:
        emoji = "";
        break;
    }
    const categoryWithEmoji = emoji + " " + category;

    if (!addedCategories.includes(categoryWithEmoji)) {
      categoriesWithEmojis.push(categoryWithEmoji);
      addedCategories.push(categoryWithEmoji);
    }
  });

  return { categoriesWithEmojis };
};

export const convertItemCategory = (items: StoreItems[]) => {};
