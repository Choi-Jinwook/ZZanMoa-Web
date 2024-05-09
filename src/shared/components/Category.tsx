import { Colors } from "@shared/constants";
import styled from "styled-components";
import Text from "./Text";

interface CategoryProps {
  category: string;
  currentCategory: string;
  handleClick: (value: string) => void;
}

const Category = ({
  category,
  currentCategory,
  handleClick,
}: CategoryProps) => {
  return (
    <Container
      key={category}
      $focus={currentCategory === category}
      onClick={() => handleClick(category)}
    >
      <Text
        variant="Body3"
        color={currentCategory === category ? "white" : Colors.Black800}
      >
        {category}
      </Text>
    </Container>
  );
};

const Container = styled.div<{ $focus: boolean }>`
  display: flex;
  border: 1px solid
    ${({ $focus }) => ($focus ? Colors.Emerald600 : Colors.Black600)};
  border-radius: 2rem;
  background-color: ${({ $focus }) => ($focus ? Colors.Emerald600 : "white")};
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
  gap: 8px;
  cursor: pointer;

  &:hover {
    ${({ $focus }) => !$focus && `background-color: ${Colors.Emerald100};`}
  }
`;

export default Category;
