import { SelectedMenu, saleContent } from "@shared/atoms";
import { SideNavigation, Text } from "@shared/components";
import { Colors } from "@shared/constants";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { useRecoilState } from "recoil";
import styled from "styled-components";

const SaleInfo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content] = useRecoilState(saleContent);
  const [currentMenu] = useRecoilState(SelectedMenu);
  const { push } = useRouter();

  useEffect(() => {
    if (currentMenu !== "할인 소식") {
      setIsLoading(true);
    }
  }, [currentMenu]);

  return (
    <Container>
      <SideNavigation />
      {isLoading ? (
        <MapContainer $isLoading={isLoading}>
          <p>위치 정보를 불러오는 중입니다.</p>
          <SyncLoader color="#79CF9F" speedMultiplier={0.6} />
        </MapContainer>
      ) : (
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
          <GoToList onClick={() => push("/")}>
            <Text
              variant="Body1"
              color={Colors.Emerald700}
              fontWeight="SemiBold"
            >
              목록으로
            </Text>
          </GoToList>
        </ContentContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100dvw;
  height: 100dvh;
`;

const MapContainer = styled.div<{ $isLoading?: boolean }>`
  display: flex;
  flex-direction: column;
  width: calc(100% - 473px);
  height: 100%;
  background-color: #ccc;
  align-items: center;
  justify-content: center;
  color: ${({ $isLoading }) => ($isLoading ? "white" : "black")};
  position: relative;
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
