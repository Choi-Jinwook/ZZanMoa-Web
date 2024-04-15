import { Colors, PRICE } from "@shared/constants";
import Text from "../Text";
import { useState } from "react";
import styled from "styled-components";

const PriceFilter = () => {
  const [currentPrice, setCurrentPrice] = useState({ start: 8000, end: 12000 });
  const [range, setRange] = useState({
    start: (currentPrice.start / PRICE.RANGE_MAX_VALUE) * 100,
    end: 100 - (currentPrice.end / PRICE.RANGE_MAX_VALUE) * 100,
  });

  const handlePrice = (target: string, value: string) => {
    const formattedValue = parseInt(value);
    if (
      target === "start" &&
      currentPrice.end - formattedValue >= PRICE.RANGE_MIN_GAP
    ) {
      setCurrentPrice((prev) => ({ ...prev, start: formattedValue }));
      setRange((prev) => ({
        ...prev,
        start: (formattedValue / PRICE.RANGE_MAX_VALUE) * 100,
      }));
    } else if (
      target === "end" &&
      formattedValue - currentPrice.start >= PRICE.RANGE_MIN_GAP
    ) {
      setCurrentPrice((prev) => ({ ...prev, end: formattedValue }));
      setRange((prev) => ({
        ...prev,
        end: 100 - (formattedValue / PRICE.RANGE_MAX_VALUE) * 100,
      }));
    }
  };

  return (
    <SetPrice>
      <PriceTitle>
        <Text variant="H4" color={Colors.Black700}>
          가격 설정
        </Text>
        <Text variant="H4" color={Colors.Emerald600}>
          {`${currentPrice.start.toLocaleString()}원 ~ ${currentPrice.end.toLocaleString()}원`}
        </Text>
      </PriceTitle>
      <PriceSetting>
        <PriceSliderContainer>
          <PriceSlider>
            <PriceSliderInner $start={range.start} $end={range.end} />
          </PriceSlider>
          <PriceSliderRangeContainer>
            <PriceSliderRange
              type="range"
              value={currentPrice.start}
              min={PRICE.RANGE_MIN_VALUE}
              max={PRICE.RANGE_MAX_VALUE}
              onChange={({ target: { value } }) => handlePrice("start", value)}
            />
            <PriceSliderRange
              type="range"
              value={currentPrice.end}
              min={PRICE.RANGE_MIN_VALUE}
              max={PRICE.RANGE_MAX_VALUE}
              onChange={({ target: { value } }) => handlePrice("end", value)}
            />
          </PriceSliderRangeContainer>
        </PriceSliderContainer>
        <PriceNotice>
          <Text>{PRICE.RANGE_MIN_VALUE.toLocaleString()}원</Text>
          <Text>{PRICE.RANGE_MAX_VALUE.toLocaleString()}원</Text>
        </PriceNotice>
      </PriceSetting>
    </SetPrice>
  );
};

const SetPrice = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const PriceTitle = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PriceSetting = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PriceSliderContainer = styled.div``;

const PriceSlider = styled.div`
  position: relative;
  width: 100%;
  height: 12px;
  border-radius: 10px;
  background-color: ${Colors.Black100};
`;

const PriceSliderInner = styled.div<{ $start: number; $end: number }>`
  position: absolute;
  left: ${({ $start }) => $start}%;
  right: ${({ $end }) => $end}%;
  height: 12px;
  border-radius: 10px;
  background-color: ${Colors.Emerald500};
`;

const PriceSliderRangeContainer = styled.div`
  position: relative;
`;

const PriceSliderRange = styled.input`
  position: absolute;
  top: -14px;
  left: -2px;
  width: 100%;
  height: 12px;
  background: none;
  pointer-events: none;

  -webkit-appearance: none;
  &::-webkit-slider-thumb {
    height: 26px;
    width: 26px;
    border-radius: 50%;
    border: 7px solid ${Colors.Emerald600};
    background-color: white;
    -webkit-appearance: none;
    pointer-events: auto;
  }
`;

const PriceNotice = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default PriceFilter;
