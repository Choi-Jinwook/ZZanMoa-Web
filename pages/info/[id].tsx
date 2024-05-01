import { saleContent } from "@shared/atoms";
import { SideNavigation, Text } from "@shared/components";
import { Colors } from "@shared/constants";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import styled from "styled-components";

const SaleInfo = () => {
  const [content] = useRecoilState(saleContent);
  const { back } = useRouter();

  return (
    <Container>
      <SideNavigation />
      <ContentContainer>
        <Title>
          <Text variant="H3" color={Colors.Black900} fontWeight="Bold">
            {content.title}
          </Text>
        </Title>
        <Content>
          <Text
            variant="Body1"
            color={Colors.Black900}
            fontWeight="Medium"
            dangerouslySetInnerHTML={{
              __html: content.content.replace(/\n/g, "<br>"),
            }}
          />
        </Content>
        <GoToList onClick={back}>
          <Text variant="Body1" color={Colors.Emerald700} fontWeight="SemiBold">
            목록으로
          </Text>
        </GoToList>
      </ContentContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100dvw;
  height: 100dvh;
`;

const ContentContainer = styled.div`
  width: 100%;
  padding: 62px 80px;
`;

const Title = styled.div`
  width: 100%;
  border-top: 1px solid ${Colors.Emerald600};
  border-bottom: 1px solid ${Colors.Black600};
  padding: 22px 0;
`;

const Content = styled.div`
  padding: 36px 0;
  white-space: pre-wrap;
  border-bottom: 1px solid ${Colors.Black600};
`;

const GoToList = styled.div`
  width: fit-content;
  padding: 12.5px 0;
  cursor: pointer;
`;

export default SaleInfo;
