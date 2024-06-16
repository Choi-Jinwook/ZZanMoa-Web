import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
`;

interface SkeletonLineProps {
  width: string;
}

const SkeletonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
`;

const SkeletonLine = styled.div<SkeletonLineProps>`
  background: #e0e0e0;
  height: 15px;
  border-radius: 4px;
  animation: ${pulse} 1.5s infinite ease-in-out;
  width: ${props => props.width};
`;

const Skeleton = () => (
  <SkeletonWrapper>
    <SkeletonLine width="80%" />
    <SkeletonLine width="80%" />
    <SkeletonLine width="80%" />
    <SkeletonLine width="80%" />
    <SkeletonLine width="80%" />
    <SkeletonLine width="80%" />
    <SkeletonLine width="80%" />
    <SkeletonLine width="80%" />
    <SkeletonLine width="80%" />
    <SkeletonLine width="60%" />
  </SkeletonWrapper>
);

export default Skeleton;
