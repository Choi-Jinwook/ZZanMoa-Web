import { Colors } from "@shared/constants";
import Text from "./Text";
import styled from "styled-components";

interface SectionTitleProps {
  numbering: number;
  title: string;
  subTitle: string;
}

const SectionTitle = ({ numbering, title, subTitle }: SectionTitleProps) => {
  return (
    <SectionTitleContainer>
      <Title>
        <Numbering>
          <Text variant="Body4" color="white" fontWeight="SemiBold">
            {numbering}
          </Text>
        </Numbering>
        <Text variant="H4" color={Colors.Black900} fontWeight="SemiBold">
          {title}
        </Text>
      </Title>
      <SubTitle variant="Body3" color={Colors.Black700}>
        {subTitle}
      </SubTitle>
    </SectionTitleContainer>
  );
};

const SectionTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Numbering = styled.div`
  display: flex;
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
  background-color: ${Colors.Emerald800};
  border-radius: 4px;
`;

const SubTitle = styled(Text)``;

export default SectionTitle;
