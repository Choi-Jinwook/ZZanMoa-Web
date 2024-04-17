import styled from "styled-components";
import { Colors } from "@shared/constants";
import { useState } from "react";
import Text from "@shared/components/Text";

const CategoryFilter = () => {
  const [currentCategory, setCurrentCategory] = useState("");

  const CATEGORY = [
    "🍚 한식",
    "🍜 중식",
    "🍝 경양식",
    "🍣 일식",
    "☕ 다방",
    "🍴 기타 음식업",
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
    <Container>
      <Text variant="H4" color={Colors.Black900} fontWeight="SemiBold">
        카테고리
      </Text>
      <CategoryContainer>
        {CATEGORY.map((category) => (
          <Category
            $focus={currentCategory === category}
            key={category}
            onClick={() => handleClick(category)}
          >
            <Text variant="Body3" color={Colors.Black800}>
              {category}
            </Text>
          </Category>
        ))}
      </CategoryContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const CategoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 8px;
`;

const Category = styled.div<{ $focus: boolean }>`
  display: flex;
  border: 1px solid
    ${({ $focus }) => ($focus ? Colors.Emerald600 : Colors.Black600)};
  border-radius: 2rem;
  background-color: ${({ $focus }) => ($focus ? Colors.Emerald50 : "white")};
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
  gap: 8px;
`;

export default CategoryFilter;
