import { Colors, PRICE } from "@shared/constants";
import Text from "../../Text";
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
      <Text variant="H4" color={Colors.Black900} fontWeight="SemiBold">
        가격 설정
      </Text>
      <PriceSetting>
        <PriceRange>
          <Text
            variant="Body4"
            color={Colors.Black800}
          >{`최소 ${PRICE.RANGE_MIN_VALUE.toLocaleString()}원`}</Text>
          <Text
            variant="Body4"
            color={Colors.Black800}
          >{`최대 ${PRICE.RANGE_MAX_VALUE.toLocaleString()}원`}</Text>
        </PriceRange>
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
          <PriceBox>
            <Text variant="Body2" color={Colors.Emerald700} fontWeight="Medium">
              {currentPrice.start.toLocaleString()}원
            </Text>
          </PriceBox>
          <PriceBox>
            <Text variant="Body2" color={Colors.Emerald700} fontWeight="Medium">
              {currentPrice.end.toLocaleString()}원
            </Text>
          </PriceBox>
        </PriceNotice>
      </PriceSetting>
    </SetPrice>
  );
};

const SetPrice = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PriceSetting = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PriceRange = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PriceSliderContainer = styled.div`
  height: 21px;
  align-content: center;
`;

const PriceSlider = styled.div`
  position: relative;
  width: 100%;
  height: 4px;
  border-radius: 10px;
  background-color: ${Colors.Black500};
`;

const PriceSliderInner = styled.div<{ $start: number; $end: number }>`
  position: absolute;
  left: ${({ $start }) => $start}%;
  right: ${({ $end }) => $end}%;
  height: 4px;
  border-radius: 10px;
  background-color: ${Colors.Emerald500};
`;

const PriceSliderRangeContainer = styled.div`
  position: relative;
`;

const PriceSliderRange = styled.input`
  position: absolute;
  top: -6px;
  left: -2px;
  width: 100%;
  height: 4px;
  background: none;
  pointer-events: none;

  -webkit-appearance: none;
  &::-webkit-slider-thumb {
    height: 21px;
    width: 21px;
    border-radius: 50%;
    border: 7px solid ${Colors.Emerald700};
    background-color: white;
    -webkit-appearance: none;
    pointer-events: auto;
  }
`;

const PriceNotice = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PriceBox = styled.div`
  display: flex;
  border: 1px solid ${Colors.Black600};
  border-radius: 4px;
  background-color: white;
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
`;

export default PriceFilter;
