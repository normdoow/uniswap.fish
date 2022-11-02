import { useEffect, useState } from "react";
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

const animatedContainerAnimation = keyframes`
  100% {
    opacity: 1;
    margin-top: 0;
  }
`;
const popupOpenAnimation = keyframes`
  0% {
    transform: translateY(-40px) rotate3d(1, 0, 0.075, 30deg);
    opacity: 0;
  }
`;
const NavPopup = styled.div`
  position: absolute;
  background: white;
  border-radius: 8px;
  width: 200px;
  overflow-y: scroll;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  padding: 5px;

  // link style
  & a {
    text-decoration: none;
    color: #555;
    display: block;
    padding: 5px;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.9rem;

    display: grid;
    grid-template-columns: 22px 1fr;
  }
  & a:hover {
    background: #fd61b7;
    color: white;
    border-radius: 6px;
  }

  // use this instead of display: none to preload iframe
  top: -1000px;

  & div.item {
    padding: 0 10px;
    border-bottom: 1px solid #eee;
  }

  & > div.animatedContainer {
    margin-top: 30px;
    opacity: 0;

    animation-name: ${animatedContainerAnimation};
    animation-duration: 0.5s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }

  &.opened {
    top: 75px;

    animation-name: ${popupOpenAnimation};
    animation-duration: 0.4s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }
`;

const Logo = () => {
  const [playLogoAnimation, setPlayLogoAnimation] = useState(false);
  const [isOpenNavPopup, setIsOpenNavPopup] = useState(false);

  useEffect(() => {
    document.addEventListener("click", ({ target }) => {
      if (target && !(target as Element).closest("#logo-container")) {
        if (isOpenNavPopup) {
          setIsOpenNavPopup(false);
        }
      }
    });
  }, [isOpenNavPopup]);

  return (
    <>
      <LogoContainer
        id="logo-container"
        onMouseEnter={() => setPlayLogoAnimation(true)}
        onMouseLeave={() => setPlayLogoAnimation(false)}
        onClick={() => setIsOpenNavPopup(!isOpenNavPopup)}
      >
        <img
          src="/logo-only-fish.png"
          className={playLogoAnimation ? "animated" : ""}
        />
        <div className={playLogoAnimation ? "bubble n1" : ""} />
        <div className={playLogoAnimation ? "bubble n2" : ""} />
        <div className={playLogoAnimation ? "bubble n3" : ""} />
      </LogoContainer>

      <NavPopup className={`${isOpenNavPopup ? "opened" : ""}`}>
        <div className={`${isOpenNavPopup ? "animatedContainer" : ""}`}>
          <a href="https://uniswap.fish">
            <span>🏠</span>
            <span>Home</span>
          </a>
          <a
            target="_blank"
            href="https://gitcoin.co/grants/4203/uniswap-calculator-v3"
          >
            <span>💰</span>
            <span>Gitcoin Donation</span>
          </a>
          <a target="_blank" href="https://github.com/chunza2542/uniswap.fish">
            <span>🧑🏻‍💻</span>
            <span>Github Repository</span>
          </a>
          <a target="_blank" href="https://twitter.com/uniswapdotfish">
            <span>🐦</span>
            <span>@uniswapdotfish</span>
          </a>
          <a href="mailto:hello@uniswap.fish">
            <span>💌</span>
            <span>hello@uniswap.fish</span>
          </a>
        </div>
      </NavPopup>
    </>
  );
};

export default Logo;
