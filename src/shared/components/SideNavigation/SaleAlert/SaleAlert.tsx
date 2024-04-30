import { Category, Chevron, Text } from "@shared/components";
import { Colors } from "@shared/constants";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

interface MockData {
  id: number;
  title: string;
  createdAt: string;
}

const SaleAlert = () => {
  const mockData: MockData[] = [
    {
      id: 800,
      title: " 장바구니 물가정보 게시(24. 2월)",
      createdAt: "2024.00.00",
    },
    {
      id: 800,
      title: " 장바구니 물가정보 게시(24. 2월)",
      createdAt: "2024.00.00",
    },
    {
      id: 800,
      title: " 장바구니 물가정보 게시(24. 2월)",
      createdAt: "2024.00.00",
    },
    {
      id: 800,
      title: " 장바구니 물가정보 게시(24. 2월)",
      createdAt: "2024.00.00",
    },
    {
      id: 800,
      title: " 장바구니 물가정보 게시(24. 2월)",
      createdAt: "2024.00.00",
    },
    {
      id: 800,
      title: " 장바구니 물가정보 게시(24. 2월)",
      createdAt: "2024.00.00",
    },
    {
      id: 800,
      title: " 장바구니 물가정보 게시(24. 2월)",
      createdAt: "2024.00.00",
    },
    {
      id: 800,
      title: " 장바구니 물가정보 게시(24. 2월)",
      createdAt: "2024.00.00",
    },
    {
      id: 800,
      title: " 장바구니 물가정보 게시(24. 2월)",
      createdAt: "2024.00.00",
    },
    {
      id: 800,
      title: " 장바구니 물가정보 게시(24. 2월)",
      createdAt: "2024.00.00",
    },
    {
      id: 800,
      title: " 장바구니 물가정보 게시(24. 2월)",
      createdAt: "2024.00.00",
    },
  ];
  const [currentCategory, setCurrentCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const { push } = useRouter();
  const CATEGORY = ["전체", "할인 소식", "직거래 마켓"];

  const handleClick = (value: string) => {
    setCurrentCategory(value);
  };

  const handleLeft = () => {
    setCurrentPage((prev) => (prev === 1 ? prev : prev - 1));
  };

  const handleRight = () => {
    setCurrentPage((prev) =>
      prev === Math.floor((mockData.length - 1) / 9) + 1 ? prev : prev + 1,
    );
  };

  const handleNumberClick = (index: number) => {
    setCurrentPage(index);
  };

  const handleClickDropDown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleRoute = (id: number) => {
    push(`/info/${id}`);
  };

  return (
    <Container>
      <Banner>
        <Image
          src="/images/banner.svg"
          alt="banner"
          width={1142}
          height={175}
        />
      </Banner>
      <ContentContainer>
        <CategoryContainer>
          <CategoryWrapper>
            {CATEGORY.map((_category) => (
              <Category
                key={_category}
                category={_category}
                currentCategory={currentCategory}
                handleClick={handleClick}
              />
            ))}
          </CategoryWrapper>
        </CategoryContainer>
        <LocateFilter>
          <LocateContainer>
            <SelectBox>
              <Text
                variant="Body1"
                color={Colors.Emerald600}
                fontWeight="Medium"
              >
                서울시 전체
              </Text>
              <SelectChevron $isOpen={isOpen} onClick={handleClickDropDown}>
                <Chevron color={Colors.Emerald600} width={28} height={28} />
              </SelectChevron>
            </SelectBox>
            <RecentPost>
              <Text variant="Body1" color={Colors.Black700}>
                최근 일주일 게시물&nbsp;
              </Text>
              <Text variant="Body1" color={Colors.Emerald600}>
                {30}
              </Text>
              <Text variant="Body1" color={Colors.Black700}>
                건
              </Text>
            </RecentPost>
            <SearchBox>
              <Input placeholder="검색어를 입력하세요" />
            </SearchBox>
          </LocateContainer>
        </LocateFilter>
        <TableContainer>
          <TableHeader>
            <NumberContainer>
              <Text variant="Body1" color={Colors.Black800} fontWeight="Medium">
                번호
              </Text>
            </NumberContainer>
            <Text variant="Body1" color={Colors.Black800} fontWeight="Medium">
              제목
            </Text>
            <CreatedAtContainer>
              <Text variant="Body1" color={Colors.Black800} fontWeight="Medium">
                등록일
              </Text>
            </CreatedAtContainer>
          </TableHeader>
          <TableContent>
            {mockData
              .slice((currentPage - 1) * 9, 9 * currentPage)
              .map(({ id, title, createdAt }, index) => (
                <BargainContent key={id + index}>
                  <NumberContainer>
                    <Text
                      variant="Body1"
                      color={Colors.Black900}
                      fontWeight="Medium"
                    >
                      {id}
                    </Text>
                  </NumberContainer>
                  <TitleContainer onClick={() => handleRoute(id)}>
                    <Text
                      variant="Body1"
                      color={Colors.Black900}
                      fontWeight="Medium"
                    >
                      {title}
                    </Text>
                  </TitleContainer>
                  <Text
                    variant="Body1"
                    color={Colors.Black900}
                    fontWeight="Medium"
                  >
                    {createdAt}
                  </Text>
                </BargainContent>
              ))}
          </TableContent>
        </TableContainer>
        <PageNation>
          <ChevronContainer onClick={handleLeft}>
            <Chevron />
          </ChevronContainer>
          {Array.from({
            length: Math.floor((mockData.length - 1) / 9) + 1,
          }).map((_, index) => {
            return (
              <Numbering
                key={index}
                $isSelected={currentPage === index + 1}
                onClick={() => handleNumberClick(index + 1)}
              >
                <Text
                  variant="Body1"
                  color={
                    currentPage === index + 1 ? "white" : Colors.Emerald600
                  }
                  fontWeight="Bold"
                >
                  {index + 1}
                </Text>
              </Numbering>
            );
          })}
          <ChevronContainer style={{ rotate: "180deg" }} onClick={handleRight}>
            <Chevron />
          </ChevronContainer>
        </PageNation>
      </ContentContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${Colors.Black200};
  padding: 62px 80px;
  gap: 36px;
  overflow: auto;
`;

const Banner = styled.div`
  width: 100%;
  height: 175px;
  text-align: center;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1142px;
  height: fit-content;
  background-color: white;
  margin: 0 auto;
  border-radius: 4px;
`;

const CategoryContainer = styled.div`
  padding: 22px 24px;
`;

const CategoryWrapper = styled.div`
  display: flex;
  gap: 16px;
`;

const LocateFilter = styled.div`
  padding: 16px 24px;
`;

const LocateContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const SelectBox = styled.div`
  display: flex;
  height: 48px;
  align-items: center;
  gap: 8px;
`;

const SelectChevron = styled.div<{ $isOpen: boolean }>`
  display: flex;
  ${({ $isOpen }) => {
    if ($isOpen) {
      return `
        rotate: 90deg;
        padding-right: 4px;
    `;
    }
    return `
      rotate: 270deg;
      padding-left: 4px;
  `;
  }}
  cursor: pointer;
`;

const RecentPost = styled.div`
  display: flex;
  flex-grow: 1;
`;

const SearchBox = styled.div`
  width: 339px;
  height: 48px;
`;

const Input = styled.input`
  width: 339px;
  height: 48px;
  outline: none;
  border: none;
  border-radius: 4px;
  background-color: ${Colors.Black300};
  padding: 0 24px;
  justify-content:;
`;

const TableContainer = styled.div`
  width: 100%;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px;
  border-top: 1px solid ${Colors.Emerald600};
  border-bottom: 1px solid ${Colors.Black600};
  text-align: center;
`;

const TableContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const BargainContent = styled.div`
  display: flex;
  border-bottom: 1px solid ${Colors.Black600};
  padding: 22px 24px;
  justify-content: space-between;
  text-align: center;
`;

const NumberContainer = styled.div`
  min-width: 70px;
  max-width: 70px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-grow: 1;
  padding: 0 55px;
  text-align: left;
  cursor: pointer;
`;

const CreatedAtContainer = styled.div`
  min-width: 115px;
  max-width: 115px;
`;

const PageNation = styled.div`
  display: flex;
  padding: 24px 0;
  gap: 20px;
  justify-content: center;
  align-items: center;
`;

const ChevronContainer = styled.div`
  display: flex;
  width: 32px;
  height: 32px;
  border: 1px solid ${Colors.Black600};
  border-radius: 6px;
  justify-content: center;
  align-items: center;

  &:hover {
    border-color: ${Colors.Emerald600};
  }
`;

const Numbering = styled.div<{ $isSelected: boolean }>`
  display: flex;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  justify-content: center;
  align-items: center;
  ${({ $isSelected }) => {
    if ($isSelected) {
      return `
        border: 1px solid ${Colors.Emerald600};
        background-color: ${Colors.Emerald600};
      `;
    }

    return `
      border: 1px solid ${Colors.Emerald600};
    `;
  }}
`;

export default SaleAlert;
