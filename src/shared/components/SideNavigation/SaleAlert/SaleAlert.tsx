import { useGetBargainDistrict, useGetBargainInfo } from "@shared/apis/bargain";
import { saleContent } from "@shared/atoms";
import {
  Category,
  Chevron,
  Divider,
  SectionTitle,
  Text,
} from "@shared/components";
import { AGREEMENT_CONTENT, Colors } from "@shared/constants";
import { convertCategoryId } from "@shared/hooks";
import { District } from "@shared/types";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

interface DistrictCheck extends District {
  checked: boolean;
}

type SubscribeType = "성공" | "실패";

const SaleAlert = () => {
  const selectBoxRef = useRef<HTMLDivElement | null>(null);
  const dropdownButtonRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [currentCategory, setCurrentCategory] = useState("할인 소식");
  const [currentCategoryId, setCurrentCategoryId] = useState(1);
  const [currentDistrict, setCurrentDistrict] = useState("서울시 전체");
  const [currentDistrictId, setCurrentDistrictId] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [agree, setAgree] = useState(false);
  const [checked, setChecked] = useState<DistrictCheck[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentSearchValue, setCurrentSearchValue] = useState("");
  const [currentTab, setCurrentTab] = useState("구독하기");
  const [email, setEmail] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<SubscribeType>("성공");
  const [toastMessage, setToastMessage] = useState("");
  const [, setContent] = useRecoilState(saleContent);
  const { push } = useRouter();
  const { data: district } = useGetBargainDistrict();
  const { data: saleInfo } = useGetBargainInfo(
    currentPage,
    currentCategoryId,
    currentDistrictId || undefined,
    searchValue === "" ? undefined : searchValue,
  );

  const CATEGORY = ["할인 소식", "직거래 마켓", "물가정보"];

  const handleClickCategory = (value: string) => {
    setCurrentCategoryId(convertCategoryId(value));
    setCurrentPage(0);
    setCurrentCategory(value);
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
    setCurrentDistrict(value);
    setCurrentDistrictId(id);
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

  const handleClickSubscribe = () => {
    setModalOpen(true);
  };

  const handleSubscribeDistrict = (index: number) => {
    setChecked((prev) => {
      let newArray: DistrictCheck[] = [];
      if (index === 0 && !prev[0].checked) {
        newArray = prev.map((item) => ({ ...item, checked: true }));
      } else if (index === 0 && prev[0].checked) {
        newArray = prev.map((item) => ({ ...item, checked: false }));
      } else if (index !== 0) {
        newArray = prev.map((item, i) =>
          (i === 0 && prev[i].checked) || i === index
            ? { ...item, checked: !prev[index].checked }
            : item,
        );
      } else {
        newArray = [];
      }

      if (index !== 0 && newArray.slice(1).every((item) => item.checked)) {
        newArray[0].checked = true;
      }

      return newArray;
    });
  };

  const handleTab = (value: string) => {
    setCurrentTab(value);
  };

  const handleEmail = (value: string) => {
    setEmail(value);
  };

  const handleToast = (type: SubscribeType, message: string) => {
    setAlertType(type);
    setToastMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };

  const handleClickSubscribeButton = async () => {
    const unChecked = checked.every(({ checked }) => !checked);

    if (!agree || unChecked) {
      handleToast(
        "실패",
        !agree ? "필수 항목이 작성되지 않았습니다." : "지역을 선택해 주세요.",
      );

      return;
    }

    try {
      const selectedDistrict = checked
        .filter(
          ({ districtName, checked }) =>
            checked && districtName !== "서울시 전체",
        )
        .map(({ districtName }) => districtName);

      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subscription`, {
        email: email,
        district: selectedDistrict,
      });

      handleToast("성공", "구독이 완료 되었습니다.");
      setEmail("");
    } catch (error: any) {
      if (error.response.status === 409) {
        handleToast("실패", "이미 구독한 내역이 존재합니다.");
      } else if (error.response.status === 400) {
        handleToast("실패", "이메일 형식이 올바르지 않습니다.");
      } else {
        handleToast("실패", "에러가 발생했습니다. 다시 시도해 주세요.");
      }
    }
  };

  const handleUnsubscribe = async () => {
    if (email === "") {
      handleToast("실패", "이메일을 입력해 주세요.");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/subscription/cancel`,
        {
          email: email,
        },
      );

      handleToast("성공", "구독이 해지되었습니다.");
      setEmail("");
    } catch (error: any) {
      if (error.response.status === 404) {
        handleToast("실패", "존재하지 않는 구독 정보입니다.");
      } else if (error.response.status === 400) {
        handleToast("실패", "이메일 형식을 확인해 주세요.");
      } else {
        handleToast("실패", "에러가 발생했습니다.");
      }
    }
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

  useEffect(() => {
    if (district) {
      setChecked(() => {
        const initialChecked = district.map(({ districtId, districtName }) => {
          return {
            districtId: districtId,
            districtName: districtName,
            checked: false,
          };
        });

        initialChecked.sort((a, b) => a.districtId - b.districtId);

        return initialChecked;
      });
    }
  }, [district]);

  return (
    <Container>
      {modalOpen && (
        <>
          <Dimmed onClick={() => setModalOpen(false)} />
          <Modal ref={modalRef}>
            <TabContainer>
              {["구독하기", "해지하기"].map((title) => {
                return (
                  <TabText key={title} $checked={currentTab === title}>
                    <Text
                      variant="Body2"
                      color={currentTab === title ? "black" : Colors.Black700}
                      fontWeight="SemiBold"
                      onClick={() => handleTab(title)}
                      style={{ cursor: "pointer" }}
                    >
                      {title}
                    </Text>
                  </TabText>
                );
              })}
            </TabContainer>
            <ModalContentContainer>
              {currentTab === "구독하기" ? (
                <>
                  <CheckBoxContainer>
                    <SectionTitle
                      numbering={1}
                      title="소식 지역 선택하기"
                      subTitle=""
                    />
                    <Divider />
                    {district?.map(({ districtId, districtName }, index) => {
                      return (
                        <CheckBoxWrapper key={districtId}>
                          <HiddenCheckBox
                            id={String(districtId)}
                            checked={checked[index].checked}
                            onChange={() => handleSubscribeDistrict(index)}
                          />
                          <SaveIDCheckBox
                            checked={checked[index].checked}
                            onClick={() => handleSubscribeDistrict(index)}
                          >
                            <Image
                              src="/images/checked.svg"
                              alt="checked"
                              width={12}
                              height={12}
                            />
                          </SaveIDCheckBox>
                          <Label htmlFor={String(districtId)}>
                            <Text variant="Body3" color={Colors.Black900}>
                              {districtName}
                            </Text>
                          </Label>
                        </CheckBoxWrapper>
                      );
                    })}
                  </CheckBoxContainer>
                  <InputContainer>
                    <SectionTitle numbering={2} title="이메일 입력하기" />
                    <Divider />
                    <SubscribeInput
                      placeholder="이메일 주소를 입력해주세요"
                      value={email}
                      onChange={({ target: { value } }) => handleEmail(value)}
                    />
                  </InputContainer>
                  <AgreementsContainer>
                    <SectionTitle numbering={3} title="약관 동의하기" />
                    <Agreements>
                      <TextContainer>
                        <Text
                          variant="Body4"
                          color={Colors.Black900}
                          fontWeight="Regular"
                          dangerouslySetInnerHTML={{
                            __html: AGREEMENT_CONTENT,
                          }}
                        ></Text>
                      </TextContainer>
                      <AgreeBox>
                        <HiddenCheckBox
                          id="agree"
                          checked={agree}
                          onChange={() => setAgree((prev) => !prev)}
                        />
                        <SaveIDCheckBox
                          checked={agree}
                          onClick={() => setAgree((prev) => !prev)}
                        >
                          <Image
                            src="/images/checked.svg"
                            alt="checked"
                            width={12}
                            height={12}
                          />
                        </SaveIDCheckBox>
                        <Label htmlFor="agree">
                          <Text variant="Body1" color={Colors.Black900}>
                            개인정보 수집 및 이용약관에 동의합니다 (필수)
                          </Text>
                        </Label>
                      </AgreeBox>
                    </Agreements>
                  </AgreementsContainer>
                  <ButtonContainer>
                    <ToastMessage $showAlert={showAlert} $type={alertType}>
                      <Image
                        src={
                          alertType === "성공"
                            ? "/images/success.svg"
                            : "/images/warn.svg"
                        }
                        alt="toast"
                        width={24}
                        height={24}
                      />
                      <Text
                        variant="Body1"
                        color={
                          alertType === "성공"
                            ? Colors.Emerald800
                            : Colors.Red100
                        }
                        fontWeight="Medium"
                      >
                        {toastMessage}
                      </Text>
                    </ToastMessage>
                    <Subscribe onClick={handleClickSubscribeButton}>
                      <Text variant="Body2" color="white" fontWeight="SemiBold">
                        신청하기
                      </Text>
                    </Subscribe>
                  </ButtonContainer>
                </>
              ) : (
                <UnSubscribeContainer>
                  <ContentWrapper>
                    <UnSubscribeTitle>
                      <Text
                        variant="Body2"
                        color={Colors.Black900}
                        fontWeight="SemiBold"
                      >
                        이메일 입력하기
                      </Text>
                    </UnSubscribeTitle>
                    <Divider />
                    <SubscribeInput
                      placeholder="이메일 주소를 입력해주세요"
                      value={email}
                      onChange={({ target: { value } }) => handleEmail(value)}
                    />
                  </ContentWrapper>
                  <UnSubscribeButton>
                    <ToastMessage $showAlert={showAlert} $type={alertType}>
                      <Image
                        src={
                          alertType === "성공"
                            ? "/images/success.svg"
                            : "/images/warn.svg"
                        }
                        alt="toast"
                        width={24}
                        height={24}
                      />
                      <Text
                        variant="Body1"
                        color={
                          alertType === "성공"
                            ? Colors.Emerald800
                            : Colors.Red100
                        }
                        fontWeight="Medium"
                      >
                        {toastMessage}
                      </Text>
                    </ToastMessage>
                    <UnSubscribe onClick={handleUnsubscribe}>
                      <Text variant="Body2" color="white" fontWeight="SemiBold">
                        해지하기
                      </Text>
                    </UnSubscribe>
                  </UnSubscribeButton>
                </UnSubscribeContainer>
              )}
            </ModalContentContainer>
          </Modal>
        </>
      )}
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
                handleClick={handleClickCategory}
              />
            ))}
          </CategoryWrapper>
        </CategoryContainer>
        <LocateFilter>
          <LocateContainer>
            {currentCategory !== "물가정보" && (
              <SelectBox ref={dropdownButtonRef}>
                <Text
                  variant="Body1"
                  color={Colors.Emerald600}
                  fontWeight="Medium"
                >
                  {currentDistrict}
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
              (
                { id, eventId, createdAt, districtId, title, content },
                index,
              ) => (
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
      <SubscribeButton onClick={handleClickSubscribe}>
        <Image src="/images/mail.svg" alt="main" width={28} height={28} />
        <Text variant="Body1" color="white" fontWeight="SemiBold">
          구독하기
        </Text>
      </SubscribeButton>
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

const Dimmed = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100dvw;
  height: 100dvh;
  background-color: ${Colors.Black800};
  opacity: 0.6;
  z-index: 8;
`;

const Modal = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 40%;
  right: 10%;
  top: 3%;
  border-radius: 16px;
  background-color: white;
  padding: 24px 0 36px 0;
  text-align: center;
  z-index: 10;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${Colors.Black600};
  padding: 0 15px;
`;

const TabText = styled.div<{ $checked: boolean }>`
  ${({ $checked }) =>
    $checked && `border-bottom: 3px solid ${Colors.Green100};`}
  padding: 0px 0px 8px 0px;
  margin-left: 47px;
`;

const ModalContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 44px 57px 0 57px;
  gap: 32px;
`;

const CheckBoxContainer = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  margin: 0 auto;
  gap: 12px;
`;

const CheckBoxWrapper = styled.div`
  display: flex;
  min-width: 90px;
  align-items: center;
  gap: 8px;
`;

const HiddenCheckBox = styled.input.attrs(({ checked, onChange }) => ({
  type: "checkbox",
  checked: checked,
  onChange: onChange,
}))`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const SaveIDCheckBox = styled.div<{ checked: boolean }>`
  display: inline-block;
  width: 18px;
  height: 18px;
  border: ${({ checked }) => !checked && `2px solid ${Colors.Black600}`};
  background-color: ${({ checked }) =>
    checked ? `${Colors.Emerald600}` : "#ffffff"};
  border-radius: 2px;
`;

const Label = styled.label``;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
`;

const AgreementsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Agreements = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const TextContainer = styled.div`
  width: 100%;
  height: 216px;
  background-color: ${Colors.Black100};
  border-top: 2px solid ${Colors.Black600};
  overflow: auto;
  padding: 12px 10px;
  text-align: left;
`;

const AgreeBox = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-start;
  gap: 8px;
`;

const ButtonContainer = styled.div`
  position: relative;
`;

const UnSubscribeButton = styled.div`
  position: relative;
  display: flex;
  width: 100%;
`;

const ToastMessage = styled.div<{ $showAlert: boolean; $type: SubscribeType }>`
  position: absolute;
  display: flex;
  top: -52px;
  width: 100%;
  background-color: ${({ $type }) =>
    $type === "성공" ? Colors.Emerald50 : "#feedec"};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  align-items: center;
  padding: 8px 16px;
  gap: 16px;
  opacity: ${({ $showAlert }) => ($showAlert ? "1" : "0")};
  visibility: ${({ $showAlert }) => ($showAlert ? "visible" : "hidden")};
  transition: all 0.2s ease-in-out;
`;

const Subscribe = styled.button`
  position: relative;
  width: 100%;
  height: 44px;
  border: 2px solid ${Colors.Emerald500};
  border-radius: 4px;
  background-color: ${Colors.Emerald500};
  cursor: pointer;
`;

const UnSubscribeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 48px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
`;

const UnSubscribeTitle = styled.div`
  align-self: flex-start;
`;

const SubscribeInput = styled.input`
  width: 100%;
  height: 48px;
  outline: none;
  border: none;
  border-radius: 4px;
  background-color: ${Colors.Black300};
  padding: 0 24px;
`;

const UnSubscribe = styled.button`
  width: 100%;
  height: 44px;
  border: 1px solid ${Colors.Emerald500};
  border-radius: 4px;
  background-color: ${Colors.Emerald500};
  cursor: pointer;
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
