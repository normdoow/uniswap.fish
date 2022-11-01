import styled, { keyframes } from "styled-components";

const fishAnimation = keyframes`
  50% {
    transform: rotateZ(10deg);
  }
`;
const LogoContainer = styled.h1`
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 50px;
  height: 50px;
  background: #feeef8;
  border-radius: 50%;
  overflow: hidden;
  position: relative;

  & img {
    width: 60px;
    position: absolute;
    left: -17px;
    top: 7px;

    animation-name: ${fishAnimation};
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
  }
`;

const Logo = () => {
  return (
    <LogoContainer>
      <img src="/logo-only-fish.png" />
      <div className="bubble" />
    </LogoContainer>
  );
};

export default Logo;
