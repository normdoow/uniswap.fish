import React from "react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "gatsby";

const Container = styled.div`
  position: relative;
  cursor: zoom-in;
  display: flex;
  align-items: center;

  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;

  & > span {
    color: #ddd;
    margin-left: 7px;
    font-size: 1.1rem;
  }
  & > span.hovered {
    color: white;
  }
`;
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
  display: flex;
  align-items: center;
  width: 45px;
  height: 45px;
  background: #feeef8;
  border-radius: 50%;
  overflow: hidden;
  position: relative;

  &.hovered {
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
const linkAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-15px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
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
    padding: 5px 8px;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.9rem;
    border: 1px solid transparent;
    display: grid;
    grid-template-columns: 22px 1fr;
    opacity: 0;
  }
  & a:hover {
    background: #feeef8;
    border: 1px solid #dfadcc;
    color: #64023d;
    border-radius: 6px;
  }
  & a.fadeIn {
    animation-name: ${linkAnimation};
    animation-duration: 0.5s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }

  // use this instead of display: none to preload iframe
  top: -1000px;

  & div.item {
    padding: 0 10px;
    border-bottom: 1px solid #eee;
  }

  & > div.animatedContainer {
    margin-top: 20px;
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

const LINKS = [
  {
    target: undefined,
    href: "/",
    icon: "🏠",
    text: "Home",
    useGatsbyLink: true,
  },
  {
    target: undefined,
    href: "/pools",
    icon: "🦄",
    text: "Pool Overview",
    useGatsbyLink: true,
  },
  {
    target: "_blank",
    href: "https://gitcoin.co/grants/4203/uniswap-calculator-v3",
    icon: "💰",
    text: "Gitcoin Donation",
  },
  {
    target: "_blank",
    href: "https://github.com/chunrapeepat/uniswap.fish",
    icon: "🧑🏻‍💻",
    text: "Github Repository",
  },
  {
    target: "_blank",
    href: "https://twitter.com/uniswapdotfish",
    icon: "🐦",
    text: "@uniswapdotfish",
  },
  {
    target: undefined,
    href: "mailto:hello@uniswap.fish",
    icon: "💌",
    text: "hello@uniswap.fish",
  },
];

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
      <Container
        id="logo-container"
        onMouseEnter={() => setPlayLogoAnimation(true)}
        onMouseLeave={() => setPlayLogoAnimation(false)}
        onClick={() => setIsOpenNavPopup(!isOpenNavPopup)}
      >
        <LogoContainer className={playLogoAnimation ? "hovered" : ""}>
          <img
            alt="Uniswap.fish Logo"
            src="/logo-only-fish.png"
            className={playLogoAnimation ? "animated" : ""}
          />
          <div className={playLogoAnimation ? "bubble n1" : ""} />
          <div className={playLogoAnimation ? "bubble n2" : ""} />
          <div className={playLogoAnimation ? "bubble n3" : ""} />
        </LogoContainer>
        <span className={playLogoAnimation ? "hovered" : ""}>
          <FontAwesomeIcon icon={faChevronDown} />
        </span>
      </Container>

      <NavPopup className={`${isOpenNavPopup ? "opened" : ""}`}>
        <div className={`${isOpenNavPopup ? "animatedContainer" : ""}`}>
          {LINKS.map((link, i) => {
            if (link.useGatsbyLink) {
              return (
                <Link
                  key={`nav_${link.text}`}
                  target={link.target}
                  className={isOpenNavPopup ? "fadeIn" : ""}
                  style={{ animationDelay: `${i * 0.075}s` }}
                  to={link.href}
                >
                  <span>{link.icon}</span>
                  <span>{link.text}</span>
                </Link>
              );
            }

            return (
              <a
                key={`nav_${link.text}`}
                target={link.target}
                className={isOpenNavPopup ? "fadeIn" : ""}
                style={{ animationDelay: `${i * 0.075}s` }}
                href={link.href}
              >
                <span>{link.icon}</span>
                <span>{link.text}</span>
              </a>
            );
          })}
        </div>
      </NavPopup>
    </>
  );
};

export default Logo;
