import React from "react";
import styled from "styled-components";
import { Colors } from "@shared/constants";
import Text from "@shared/components/Text";
import Skeleton from "@shared/components/Skeleton";

const ModalContainer = styled.div`
  position: fixed;
  bottom: 0%;
  left: 45%;
  transform: translateX(-50%);
  width: 345px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  z-index: 10;
  padding-bottom: 20px;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 20px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const ReviewContent = styled.div`
  margin-top: 20px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
  gap: 8px;
  border-radius: 16px;
  box-shadow:
    0px 8px 16px rgba(0, 0, 0, 0.14),
    0px 0px 2px rgba(0, 0, 0, 0.12);
  text-align: center;
  width: 80%;
  margin: 0 auto;
`;

const LoadingText = styled(Text)`
  color: ${Colors.Black900};
  margin-top: 10px;
`;

const CompleteText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${Colors.Black900};
  text-align: center;
  margin-top: 20px;
  background: #ffffff;
  padding: 10px;
  border-radius: 16px;
  gap: 10px;
  box-shadow:
    0px 8px 16px rgba(0, 0, 0, 0.14),
    0px 0px 2px rgba(0, 0, 0, 0.12);
`;

const StoreName = styled(Text)`
  position: relative;
  display: inline-block;
  margin-bottom: 10px;

  &:after {
    content: "";
    display: block;
    width: 100%;
    height: 3px;
    background-color: ${Colors.Emerald600};
    position: absolute;
    bottom: -2px;
    left: 0;
  }
`;

const FooterText = styled(Text)`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  text-align: center;
`;

const convertMarkdownToHtml = (markdown: string) => {
  return markdown.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
};

interface ReviewModalProps {
  reviews?: string[];
  storeName: string;
  onClose: () => void;
}

const ReviewModal = ({ reviews, storeName, onClose }: ReviewModalProps) => (
  <ModalContainer>
    <ModalContent>
      <CloseButton onClick={onClose}>&times;</CloseButton>
      <Header>
        <img
          src="/images/aiReviewIcon.svg"
          alt="리뷰 아이콘"
          style={{ width: 24, height: 24 }}
        />
        <Text
          variant="Body1"
          color={Colors.Black900}
          fontWeight="SemiBold"
          style={{ marginLeft: "10px" }}
        >
          AI 리뷰
        </Text>
      </Header>
      <StoreName variant="Body1" color={Colors.Black900} fontWeight="SemiBold">
        {storeName}
      </StoreName>
      {reviews ? (
        <ReviewContent>
          {reviews.map((review, index) => (
            <Text
              key={index}
              variant="Body3"
              color={Colors.Black900}
              fontWeight="Regular"
              style={{ marginBottom: "10px", whiteSpace: "pre-wrap" }}
              dangerouslySetInnerHTML={{
                __html: convertMarkdownToHtml(review),
              }}
            />
          ))}
          <CompleteText variant="Body3" fontWeight="Regular">
            <img
              src="/images/aiImage.svg"
              alt="리뷰 아이콘"
              style={{ width: 43, height: 38 }}
            />
            AI가 리뷰 요약을 완료했어요
          </CompleteText>
          <FooterText
            variant="Body4"
            color={Colors.Black700}
            fontWeight="Medium"
          >
            AI는 실수를 할 수 있습니다. 중요한 정보를 확인하세요.
          </FooterText>
        </ReviewContent>
      ) : (
        <>
          <Skeleton />
          <LoadingContainer>
            <img
              src="/images/aiImage.svg"
              alt="리뷰 아이콘"
              style={{ width: 43, height: 38 }}
            />
            <LoadingText variant="Body3" fontWeight="Regular">
              AI가 리뷰를 요약하고 있어요
            </LoadingText>
          </LoadingContainer>
        </>
      )}
    </ModalContent>
  </ModalContainer>
);

export default ReviewModal;
