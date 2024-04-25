import styled from "styled-components";
import { Colors } from "@shared/constants";
import Text from "@shared/components/Text";
import { useGetCategory } from "@shared/apis";
import { useRecoilState } from "recoil";
import { MinMaxPrice, SelectedCategory } from "@shared/atoms";
import { convertCategory } from "@shared/hooks";
import { useEffect } from "react";

const CategoryFilter = () => {
  const { data: categories } = useGetCategory();
  const [, setPrice] = useRecoilState(MinMaxPrice);
  const [currentCategory, setCurrentCategory] =
    useRecoilState(SelectedCategory);
  const { categoriesWithEmojis } = convertCategory(categories);

  const handleClick = (value: string) => {
    setCurrentCategory(value);
  };

  useEffect(() => {
    const categoryData = categories?.find(
      ({ category }) => category === currentCategory.split(" ").reverse()[0],
    );
    if (categoryData) {
      const { minPrice, maxPrice } = categoryData;
      setPrice({ minPrice, maxPrice });
    }
  }, [currentCategory]);

  return (
    <Container>
      <Text variant="H4" color={Colors.Black900} fontWeight="SemiBold">
        카테고리
      </Text>
      <CategoryContainer>
        {categoriesWithEmojis.map((category) => (
          <Category
            key={category}
            $focus={currentCategory === category}
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
