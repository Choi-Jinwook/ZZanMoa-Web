import { useGetBargainDistrict, useGetBargainInfo } from "@shared/apis/bargain";
import { saleContent } from "@shared/atoms";
import { Category, Chevron, Text } from "@shared/components";
import { Colors } from "@shared/constants";
import { convertCategoryId } from "@shared/hooks";
import Image from "next/image";
import { useRouter } from "next/router";
import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import Modal from "./Modal";

interface Categories {
  currentCategory: string;
  currentCategoryId: number;
}

interface Districts {
  currentDistrict: string;
  currentDistrictId: number;
}

const SaleAlert = () => {
  const selectBoxRef = useRef<HTMLDivElement | null>(null);
  const dropdownButtonRef = useRef<HTMLDivElement | null>(null);
  const [categories, setCategories] = useState<Categories>({
    currentCategory: "할인 소식",
    currentCategoryId: 1,
  });
  const [districts, setDistricts] = useState<Districts>({
    currentDistrict: "서울시 전체",
    currentDistrictId: 0,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentSearchValue, setCurrentSearchValue] = useState("");
  const [, setContent] = useRecoilState(saleContent);
  const { push } = useRouter();
  const { data: district } = useGetBargainDistrict();
  const { data: saleInfo } = useGetBargainInfo(
    currentPage,
    categories.currentCategoryId,
    districts.currentDistrictId || undefined,
    searchValue === "" ? undefined : searchValue,
  );

  const CATEGORY = ["할인 소식", "직거래 마켓", "물가정보"];

  const handleClickCategory = (value: string) => {
    setCategories({
      currentCategory: value,
      currentCategoryId: convertCategoryId(value),
    });
    setCurrentPage(0);
  };

  const handleLeft = () => {
    setCurrentPage((prev) => (prev === 0 ? prev : prev - 10));
  };

  const handleRight = () => {
    setCurrentPage((prev) =>
      prev + 10 > Number(saleInfo?.totalPages)
        ? Number(saleInfo?.totalPages) - 1
        : prev + 10,
    );
  };

  const handleNumberClick = (index: number) => {
    setCurrentPage(index + Math.floor(currentPage / 10) * 10);
  };

  const handleClickDropDown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleDistrict = (value: string, id: number) => {
    setDistricts({ currentDistrict: value, currentDistrictId: id });
    setCurrentPage(0);
    setIsOpen(false);
  };

  const handleRoute = (id: number) => {
    const selectedContent = saleInfo?.content.filter(({ id: _id, content }) => {
      return id === _id ? content : null;
    });

    if (selectedContent) {
      setContent({
        title: selectedContent[0].title,
        content: selectedContent[0].content,
      });
      push(`/info/${id}`);
    }
  };

  const handleSearch = (value: string) => {
    setCurrentSearchValue(value);
  };

  const handleEnter = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.stopPropagation();
      setSearchValue(currentSearchValue);
    }
  };

  const handleModal = () => {
    setModalOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutSide = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !dropdownButtonRef.current?.contains(target) &&
        !selectBoxRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", (e: any) => handleClickOutSide(e));

    return () => {
      window.removeEventListener("click", (e: any) => handleClickOutSide(e));
    };
  }, []);

  return (
    <Container>
      <Modal
        modalOpen={modalOpen}
        handleModal={handleModal}
        district={district}
      />
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
                currentCategory={categories.currentCategory}
                handleClick={handleClickCategory}
              />
            ))}
          </CategoryWrapper>
        </CategoryContainer>
        <LocateFilter>
          <LocateContainer>
            {categories.currentCategory !== "물가정보" && (
              <SelectBox ref={dropdownButtonRef}>
                <Text
                  variant="Body1"
                  color={Colors.Emerald600}
                  fontWeight="Medium"
                >
                  {districts.currentDistrict}
                </Text>
                <SelectChevron $isOpen={isOpen} onClick={handleClickDropDown}>
                  <Chevron color={Colors.Emerald600} width={28} height={28} />
                </SelectChevron>
                {isOpen && (
                  <DropDownContainer ref={selectBoxRef}>
                    {district?.map(({ districtId, districtName }, index) => (
                      <DropDown
                        key={districtId}
                        $isLast={index === district.length - 1}
                        onClick={() => handleDistrict(districtName, districtId)}
                      >
                        <Text
                          variant="Body3"
                          color={Colors.Black900}
                          fontWeight="Medium"
                        >
                          {districtName}
                        </Text>
                      </DropDown>
                    ))}
                  </DropDownContainer>
                )}
              </SelectBox>
            )}
            <RecentPost>
              <Text variant="Body1" color={Colors.Black700}>
                최근 일주일 게시물&nbsp;
              </Text>
              <Text variant="Body1" color={Colors.Emerald600}>
                {saleInfo?.recentNewsCount}
              </Text>
              <Text variant="Body1" color={Colors.Black700}>
                건
              </Text>
            </RecentPost>
            <SearchBox>
              <Input
                placeholder="검색어를 입력하세요"
                onChange={({ target: { value } }) => handleSearch(value)}
                onKeyDown={(e) => handleEnter(e)}
              />
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
            {saleInfo?.content?.map(
              ({ id, createdAt, districtId, title }, index) => (
                <BargainContent key={id + index + districtId + title}>
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
                      dangerouslySetInnerHTML={{ __html: title }}
                    />
                  </TitleContainer>
                  <Text
                    variant="Body1"
                    color={Colors.Black900}
                    fontWeight="Medium"
                  >
                    {createdAt}
                  </Text>
                </BargainContent>
              ),
            )}
          </TableContent>
        </TableContainer>
        <PageNation>
          <ChevronContainer onClick={handleLeft}>
            <Chevron />
          </ChevronContainer>
          {Array.from({
            length: 10,
          }).map((_, index) => {
            if (
              Math.floor(currentPage / 10) * 10 + index + 1 >
              Number(saleInfo?.totalPages)
            )
              return;
            return (
              <Numbering
                key={index}
                $isSelected={currentPage % 10 === index}
                onClick={() => handleNumberClick(index)}
              >
                <Text
                  variant="Body1"
                  color={
                    currentPage % 10 === index ? "white" : Colors.Emerald600
                  }
                  fontWeight="Bold"
                >
                  {Math.floor(currentPage / 10) * 10 + index + 1}
                </Text>
              </Numbering>
            );
          })}
          <ChevronContainer style={{ rotate: "180deg" }} onClick={handleRight}>
            <Chevron />
          </ChevronContainer>
        </PageNation>
      </ContentContainer>
      <SubscribeButton onClick={handleModal}>
        <Image src="/images/mail.svg" alt="main" width={28} height={28} />
        <Text variant="Body1" color="white" fontWeight="SemiBold">
          구독하기
        </Text>
      </SubscribeButton>
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${Colors.Black200};
  padding: 62px 80px;
  gap: 36px;
  overflow: auto;
`;

const Banner = styled.header`
  width: 100%;
  height: 175px;
  text-align: center;
`;

const ContentContainer = styled.article`
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
  width: 100%;
  padding: 16px 24px;
`;

const LocateContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 12px;
  align-items: center;
`;

const SelectBox = styled.div`
  display: flex;
  position: relative;
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

const DropDownContainer = styled.div`
  position: absolute;
  top: 48px;
  height: 560px;
  box-shadow: 0px 0px 8px 0px rgba(212, 157, 157, 0.75);
  border: 1px solid white;
  border-radius: 4px;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const DropDown = styled.div<{ $isLast?: boolean }>`
  position: relative;
  width: 168px;
  padding: 12px 16px;
  background-color: white;
  z-index: 5;
  ${({ $isLast }) => {
    if (!$isLast) {
      return `border-bottom: 1px solid ${Colors.Black600};`;
    }
  }}
  cursor: pointer;

  &:hover {
    background-color: ${Colors.Black200};
  }
`;

const RecentPost = styled.div`
  display: flex;
  flex-grow: 1;
`;

const SearchBox = styled.div`
  width: 491px;
  height: 48px;
`;

const Input = styled.input`
  width: 491px;
  height: 48px;
  outline: none;
  border: none;
  border-radius: 4px;
  background-color: ${Colors.Black300};
  padding: 0 24px;
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

const SubscribeButton = styled.button`
  position: absolute;
  display: flex;
  bottom: 80px;
  right: 110px;
  border-radius: 60px;
  background-color: ${Colors.Black900};
  padding: 10px 24px;
  gap: 10px;
  cursor: pointer;
`;

export default SaleAlert;
