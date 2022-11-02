import { useState } from "react";
import styled, { keyframes } from "styled-components";

const fishAnimation = keyframes`
  50% {
    transform: rotateZ(10deg);
  }
`;
const bubbleAnimation = keyframes`
  100% {
    bottom: 65px;
  }
`;
const LogoContainer = styled.h1`
  margin: 0;
  cursor: zoom-in;
  display: flex;
  align-items: center;
  width: 45px;
  height: 45px;
  background: #feeef8;
  border-radius: 50%;
  overflow: hidden;
  position: relative;

  &:hover {
    box-shadow: 0px 0px 15px 0px rgba(254, 238, 248, 0.75);
    -webkit-box-shadow: 0px 0px 15px 0px rgba(254, 238, 248, 0.75);
    -moz-box-shadow: 0px 0px 15px 0px rgba(254, 238, 248, 0.75);
  }
  &:active {
    box-shadow: 0px 0px 15px 0px rgba(254, 238, 248, 0);
    -webkit-box-shadow: 0px 0px 15px 0px rgba(254, 238, 248, 0);
    -moz-box-shadow: 0px 0px 15px 0px rgba(254, 238, 248, 0);
  }

  & img {
    width: 55px;
    position: absolute;
    left: -17px;
    top: 6px;
    z-index: 999;
    -webkit-user-drag: none;
  }

  & img.animated {
    animation-name: ${fishAnimation};
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
  }
  & div.bubble {
    border-radius: 100%;
    position: absolute;

    animation-name: ${bubbleAnimation};
    animation-iteration-count: infinite;
    animation-timing-function: ease-in;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
  }
  & div.bubble.n1 {
    bottom: -15px;
    left: 50%;
    width: 8px;
    height: 8px;
    background: hsl(323, 89%, 91%);
    animation-duration: 2s;
  }
  & div.bubble.n2 {
    bottom: -15px;
    left: 75%;
    width: 5px;
    height: 5px;
    background: hsl(323, 89%, 87%);
    animation-delay: 0.5s;
    animation-duration: 1.75s;
  }
  & div.bubble.n3 {
    bottom: -15px;
    left: 65%;
    width: 3px;
    height: 3px;
    background: hsl(323, 89%, 82%);
    animation-delay: 1s;
    animation-duration: 1.5s;
  }
`;

const Logo = () => {
  const [playLogoAnimation, setPlayLogoAnimation] = useState(false);

  return (
    <LogoContainer
      onMouseEnter={() => setPlayLogoAnimation(true)}
      onMouseLeave={() => setPlayLogoAnimation(false)}
    >
      <img
        src="/logo-only-fish.png"
        className={playLogoAnimation ? "animated" : ""}
      />
      <div className={playLogoAnimation ? "bubble n1" : ""} />
      <div className={playLogoAnimation ? "bubble n2" : ""} />
      <div className={playLogoAnimation ? "bubble n3" : ""} />
    </LogoContainer>
  );
};

export default Logo;
