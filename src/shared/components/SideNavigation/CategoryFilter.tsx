import Image from "next/image";
import styled from "styled-components";
import Text from "../Text";
import { Colors } from "@shared/constants";
import { useState } from "react";

const CategoryFilter = () => {
  const [currentCategory, setCurrentCategory] = useState("");

  const CATEGORY = [
    "🍚 한식",
    "🍜 중식",
    "🍝 경양식",
    "🍣 일식",
    "🍴 기타 음식업",
    "☕ 다방",
    "💈 미용/이용",
    "👕 세탁",
    "🎬 영화",
    "🛏️ 숙박",
    "기타 서비스",
  ];

  const handleClick = (value: string) => {
    setCurrentCategory(value);
  };

  return (
    <>
      <Text variant="H4">카테고리</Text>
      <CategoryContainer>
        {CATEGORY.map((category) => (
          <Category
            $focus={currentCategory === category}
            key={category}
            onClick={() => handleClick(category)}
          >
            {currentCategory === category && (
              <Image
                src="/images/check.svg"
                alt="check"
                width={18}
                height={18}
              />
            )}
            <Text variant="Body3">{category}</Text>
          </Category>
        ))}
      </CategoryContainer>
    </>
  );
};

const CategoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 8px;
`;

const Category = styled.div<{ $focus: boolean }>`
  display: flex;
  border: 1px solid
    ${({ $focus }) => ($focus ? Colors.Emerald500 : Colors.Black100)};
  border-radius: 2rem;
  background-color: ${({ $focus }) =>
    $focus ? Colors.Emerald50 : "transparent"};
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
  gap: 8px;
`;

export default CategoryFilter;
