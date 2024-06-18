import styled from "styled-components";
import { Colors } from "@shared/constants";
import { ReactNode, useState } from "react";
import { Text } from "@shared/components";

interface AccordionProps {
    title: string;
    children: ReactNode;
}

const Accordion = ({ title, children }: AccordionProps) => {
    const [isOpen, setIsOpen] = useState(true);
    const toggleAccordion = () => setIsOpen(prev => !prev);

    return (<>
        <TitleRow>
            <Text variant="H4" color={Colors.Black900} fontWeight="SemiBold">
                {title}
            </Text>
            <ToggleButton onClick={toggleAccordion}>
                {isOpen ? '▼' : '▶'}
            </ToggleButton>
        </TitleRow>
        {isOpen && children}

    </>)
}

const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: ${Colors.Black900};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default Accordion;