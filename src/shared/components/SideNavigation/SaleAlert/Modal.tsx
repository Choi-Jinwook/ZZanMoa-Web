import { postSubscription, postSubscriptionCancel } from "@shared/apis/bargain";
import Divider from "@shared/components/Divider";
import SectionTitle from "@shared/components/SectionTitle";
import Text from "@shared/components/Text";
import { AGREEMENT_CONTENT, Colors } from "@shared/constants";
import { District } from "@shared/types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface DistrictCheck extends District {
  checked: boolean;
}

type SubscribeType = "성공" | "실패";

interface ModalProps {
  modalOpen: boolean;
  handleModal: () => void;
  district?: District[];
}

const Modal = ({ modalOpen, handleModal, district }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [currentTab, setCurrentTab] = useState("구독하기");
  const [checked, setChecked] = useState<DistrictCheck[]>([]);
  const [alertType, setAlertType] = useState<SubscribeType>("성공");

  const handleTab = (value: string) => {
    setCurrentTab(value);
  };

  const handleSubscribeDistrict = (index: number) => {
    setChecked((prev) => {
      const newArray = [...prev];

      if (index === 0) {
        const allChecked = newArray[0].checked;
        newArray.forEach((item) => (item.checked = !allChecked));
      } else {
        newArray[index].checked = !newArray[index].checked;

        const allCheckedExceptFirst = newArray
          .slice(1)
          .every((item) => item.checked);
        newArray[0].checked = allCheckedExceptFirst;
      }

      return newArray;
    });
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

      await postSubscription(email, selectedDistrict);

      handleToast("성공", "구독이 완료 되었습니다.");
      setEmail("");
    } catch (error: any) {
      switch (error?.response?.status) {
        case 409:
          handleToast("실패", "이미 구독한 내역이 존재합니다.");
          return;
        case 400:
          handleToast("실패", "이메일 형식이 올바르지 않습니다.");
          return;
        default:
          handleToast("실패", "에러가 발생했습니다. 다시 시도해 주세요.");
          return;
      }
    }
  };

  const handleUnsubscribe = async () => {
    if (email === "") {
      handleToast("실패", "이메일을 입력해 주세요.");
      return;
    }

    try {
      await postSubscriptionCancel(email);

      handleToast("성공", "구독이 해지되었습니다.");
      setEmail("");
    } catch (error: any) {
      switch (error?.response?.status) {
        case 404:
          handleToast("실패", "존재하지 않는 구독 정보입니다.");
          return;
        case 400:
          handleToast("실패", "이메일 형식을 확인해 주세요.");
          return;
        default:
          handleToast("실패", "에러가 발생했습니다.");
          return;
      }
    }
  };

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
    <>
      {modalOpen && (
        <>
          <Dimmed onClick={handleModal} />
          <ModalContent ref={modalRef}>
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
                            checked={checked[index]?.checked}
                            onChange={() => handleSubscribeDistrict(index)}
                          />
                          <SaveIDCheckBox
                            checked={checked[index]?.checked}
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
          </ModalContent>
        </>
      )}
    </>
  );
};

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

const ModalContent = styled.div`
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

export default Modal;
