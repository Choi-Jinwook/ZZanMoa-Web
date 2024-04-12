import { Colors } from "@shared/constants";
import { FontVariant } from "@shared/types";
import { HTMLAttributes } from "react";
import styled from "styled-components";

interface TextProps
  extends HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> {
  variant?: FontVariant;
  color?: string;
}

const Text = ({
  variant = "Body1",
  color = Colors.Black400,
  children,
  ...props
}: TextProps) => {
  switch (variant) {
    case "H1":
      return (
        <H1 color={color} {...props}>
          {children}
        </H1>
      );
    case "H2":
      return (
        <H2 color={color} {...props}>
          {children}
        </H2>
      );
    case "H3":
      return (
        <H3 color={color} {...props}>
          {children}
        </H3>
      );
    case "H4":
      return (
        <H4 color={color} {...props}>
          {children}
        </H4>
      );
    case "Body1":
      return (
        <Body1 color={color} {...props}>
          {children}
        </Body1>
      );
    case "Body2":
      return (
        <Body2 color={color} {...props}>
          {children}
        </Body2>
      );
    case "Body3":
      return (
        <Body3 color={color} {...props}>
          {children}
        </Body3>
      );
    case "Body4":
      return (
        <Body4 color={color} {...props}>
          {children}
        </Body4>
      );
  }
};

const H1 = styled.h1<TextProps>`
  font-size: 64px;
  font-weight: 600;
  line-height: 76px;
  letter-spacing: 0.03em;
  color: ${({ color }) => color};
`;

const H2 = styled.h2<TextProps>`
  font-size: 36px;
  font-weight: 600;
  line-height: 44px;
  letter-spacing: 0.03em;
  color: ${({ color }) => color};
`;

const H3 = styled.h3<TextProps>`
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
  letter-spacing: 0.03em;
  color: ${({ color }) => color};
`;

const H4 = styled.h4<TextProps>`
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: 0.03em;
  color: ${({ color }) => color};
`;

const Body1 = styled.p<TextProps>`
  font-size: 18px;
  line-height: 28px;
  color: ${({ color }) => color};
`;

const Body2 = styled.p<TextProps>`
  font-size: 16px;
  line-height: 24px;
  color: ${({ color }) => color};
`;

const Body3 = styled.p<TextProps>`
  font-size: 14px;
  line-height: 20px;
  color: ${({ color }) => color};
`;

const Body4 = styled.p<TextProps>`
  font-size: 12px;
  line-height: 16px;
  color: ${({ color }) => color};
`;

export default Text;
