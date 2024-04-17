import { Colors } from "@shared/constants";
import styled from "styled-components";

const Divider = () => {
  return <DividerLine />;
};

const DividerLine = styled.div`
  width: 100%;
  border: 1px solid ${Colors.Black600};
`;

export default Divider;
