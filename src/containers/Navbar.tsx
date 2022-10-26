import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import styled, { keyframes } from "styled-components";
import { ScreenWidth } from "../utils/styled";
// import { useModalContext } from "../context/modal/modalContext";
// import { ModalActionType } from "../context/modal/modalReducer";

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: rgb(0, 0, 0, 0.9);
  position: absolute;
  width: 100vw;
  top: 0;
  /* z-index: 9999; */
  z-index: 9999999999; // TODO: remove this

  @media only screen and (max-width: ${ScreenWidth.TABLET}px) {
    padding: 15px;
  }
`;

const Logo = styled.h1`
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;

  & > span:nth-child(1) {
    font-size: 1.4rem;
    margin-right: 7px;

    @media only screen and (max-width: 450px) {
      font-size: 1.8rem;
    }
  }

  & > span:nth-child(2) {
    color: white;
    font-size: 1.2rem;
    font-weight: 500;

    @media only screen and (max-width: 450px) {
      display: none;
    }
  }
`;

const Menubar = styled.div`
  display: flex;
  align-items: center;
`;

const Twitter = styled.a`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.2rem;

  &:hover {
    color: #1f9cea;
    transform: scale(1.25) rotate(18deg);
  }
`;

const badgeAnimaation = keyframes`
  0% {
    transform: scale(0);
    background: #f73c01;
  }
  100% {
    transform: scale(3);
    background: transparent;
  }
`;
const WhatsNew = styled.a`
  /* color: rgba(255, 255, 255, 0.6); */
  color: white;
  font-size: 1rem;
  margin-right: 18px;
  cursor: pointer;
  position: relative;

  &:hover {
    color: white;
  }

  & > span.badge {
    background: #f73c01;
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    position: absolute;
    top: -2px;
    left: -8px;
    z-index: 9999;
  }
  & > span.animatedBadge {
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    position: absolute;
    top: -2px;
    left: -8px;

    animation-name: ${badgeAnimaation};
    animation-duration: 1.25s;
    animation-iteration-count: infinite;
    animation-fill-mode: forwards;
  }
  & > span.disabled {
    display: none;
  }
`;

const Navbar = () => {
  const [playSplashAnimation, setPlaySplashAnimation] = useState(false);
  const animatedBadgeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    animatedBadgeRef.current?.addEventListener("animationiteration", (ev) => {
      if (playSplashAnimation) {
        animatedBadgeRef.current?.classList.add("disabled");
      }
    });
  }, [playSplashAnimation]);

  return (
    <NavbarContainer>
      <Logo>
        <span>🦄</span> <span>UniswapCalculator</span>
      </Logo>
      <Menubar>
        <WhatsNew
          onClick={() => {
            setPlaySplashAnimation(true);
          }}
        >
          What's New
          <span className="badge" />
          <span ref={animatedBadgeRef} className="animatedBadge" />
        </WhatsNew>
        <Twitter
          href="https://twitter.com/uniswapdotfish"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faTwitter} />
        </Twitter>
      </Menubar>
    </NavbarContainer>
  );
};

export default Navbar;
