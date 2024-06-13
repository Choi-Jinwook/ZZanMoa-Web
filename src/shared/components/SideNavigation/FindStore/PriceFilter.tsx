import { Colors, PRICE } from "@shared/constants";
import Text from "../../Text";
import { useEffect } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { CurrentPrice, MinMaxPrice, Range } from "@shared/atoms";
import Accordion from "@shared/components/Accordion";

const PriceFilter = () => {
  const [price] = useRecoilState(MinMaxPrice);
  const [currentPrice, setCurrentPrice] = useRecoilState(CurrentPrice);
  const [range, setRange] = useRecoilState(Range);

  const handlePrice = (target: string, value: string) => {
    const formattedValue = parseInt(value);
    const priceRange = price.maxPrice - price.minPrice;

    if (
      target === "start" &&
      currentPrice.maxPrice - formattedValue >= PRICE.RANGE_MIN_GAP
    ) {
      setCurrentPrice((prev) => ({ ...prev, minPrice: formattedValue }));
      setRange((prev) => ({
        ...prev,
        start: ((formattedValue - price.minPrice) / priceRange) * 100,
      }));
    } else if (
      target === "end" &&
      formattedValue - currentPrice.minPrice >= PRICE.RANGE_MIN_GAP
    ) {
      setCurrentPrice((prev) => ({ ...prev, maxPrice: formattedValue }));
      setRange((prev) => ({
        ...prev,
        end: ((price.maxPrice - formattedValue) / priceRange) * 100,
      }));
    }
  };

  useEffect(() => {
    setCurrentPrice({ minPrice: price.minPrice, maxPrice: price.maxPrice });
    setRange({ start: 0, end: 0 });
  }, [price]);

  return (
    <SetPrice>
      <Accordion title="가격 설정">
        <PriceSetting>
          <PriceRange>
            <Text
              variant="Body4"
              color={Colors.Black800}
            >{`최소 ${currentPrice.minPrice.toLocaleString()}원`}</Text>
            <Text
              variant="Body4"
              color={Colors.Black800}
            >{`최대 ${currentPrice.maxPrice.toLocaleString()}원`}</Text>
          </PriceRange>
          <PriceSliderContainer>
            <PriceSlider>
              <PriceSliderInner $start={range.start} $end={range.end} />
            </PriceSlider>
            <PriceSliderRangeContainer>
              <PriceSliderRange
                type="range"
                value={currentPrice.minPrice}
                min={price.minPrice}
                max={price.maxPrice}
                onChange={({ target: { value } }) => handlePrice("start", value)}
                step={100}
              />
              <PriceSliderRange
                type="range"
                value={currentPrice.maxPrice}
                min={price.minPrice}
                max={price.maxPrice}
                onChange={({ target: { value } }) => handlePrice("end", value)}
                step={100}
              />
            </PriceSliderRangeContainer>
          </PriceSliderContainer>
          <PriceNotice>
            <PriceBox>
              <Text variant="Body2" color={Colors.Emerald700} fontWeight="Medium">
                {currentPrice.minPrice.toLocaleString()}원
              </Text>
            </PriceBox>
            <PriceBox>
              <Text variant="Body2" color={Colors.Emerald700} fontWeight="Medium">
                {currentPrice.maxPrice.toLocaleString()}원
              </Text>
            </PriceBox>
          </PriceNotice>
        </PriceSetting>
      </Accordion>
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
