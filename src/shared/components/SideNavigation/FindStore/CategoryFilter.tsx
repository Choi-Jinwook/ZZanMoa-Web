import styled from "styled-components";
import { Colors } from "@shared/constants";
import Text from "@shared/components/Text";
import { useGetCategory } from "@shared/apis";
import { useRecoilState } from "recoil";
import { MinMaxPrice, SelectedCategory } from "@shared/atoms";
import { useEffect } from "react";

const CategoryFilter = () => {
  const { data: categories } = useGetCategory();
  const [, setPrice] = useRecoilState(MinMaxPrice);
  const [currentCategory, setCurrentCategory] =
    useRecoilState(SelectedCategory);

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
        <CategoryWrapper>
          <TextContainer>
            <Text color="#000000" variant="Body3" fontWeight="Medium">
              음식
            </Text>
          </TextContainer>
          <CategoryContent>
            {categories?.slice(0, 6).map(({ category }) => (
              <Category
                key={category}
                $focus={currentCategory === category}
                onClick={() => handleClick(category)}
              >
                <Text
                  variant="Body3"
                  color={
                    currentCategory === category ? "white" : Colors.Black800
                  }
                >
                  {category}
                </Text>
              </Category>
            ))}
          </CategoryContent>
        </CategoryWrapper>
        <CategoryWrapper>
          <TextContainer>
            <Text color="#000000" variant="Body3" fontWeight="Medium">
              서비스
            </Text>
          </TextContainer>
          <CategoryContent>
            {categories?.slice(6, 15).map(({ category }) => (
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
          </CategoryContent>
        </CategoryWrapper>
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
  gap: 16px;
`;

const CategoryContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TextContainer = styled.div`
  min-width: 40px;
`;

const CategoryWrapper = styled.div`
  display: flex;
  gap: 16px;
`;

const Category = styled.div<{ $focus: boolean }>`
  display: flex;
  border: 1px solid
    ${({ $focus }) => ($focus ? Colors.Emerald600 : Colors.Black600)};
  border-radius: 2rem;
  background-color: ${({ $focus }) => ($focus ? Colors.Emerald600 : "white")};
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
  gap: 8px;
`;

export default CategoryFilter;
