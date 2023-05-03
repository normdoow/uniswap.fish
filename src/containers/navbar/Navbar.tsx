import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import styled from "styled-components";
import { ScreenWidth } from "../../utils/styled";
import Announcement from "./Announcement";
import Logo from "./Logo";
import { DangerButton } from "../../common/components/atomic";

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: rgba(0, 0, 0, 0.9);
  position: absolute;
  width: 100vw;
  top: 0;
  z-index: 9999;

  @media only screen and (max-width: ${ScreenWidth.TABLET}px) {
    padding: 15px;
  }
`;

const Menubar = styled.div`
  display: flex;
  align-items: center;
`;

const Twitter = styled.a`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.2rem;
  margin-right: 15px;

  &:hover {
    color: #1f9cea;
    transform: scale(1.25) rotate(18deg);
  }
`;
const GitcoinGrant = styled.div`
  font-size: 1rem;
  position: relative;

  & a {
    text-decoration: none;
  }

  & .countdown {
    position: absolute;
    right: 0;
    color: white;
    display: block;
    text-align: right;
    font-size: 0.675rem;
    margin-top: 7px;
  }
`;

const Navbar = () => {
  return (
    <>
      <NavbarContainer>
        <Logo />
        <Menubar id="menubar-container">
          <GitcoinGrant>
            <a
              target="_blank"
              href="https://explorer.gitcoin.co/#/round/1/0x12bb5bbbfe596dbc489d209299b8302c3300fa40/0x12bb5bbbfe596dbc489d209299b8302c3300fa40-78"
            >
              <DangerButton>
                <span>Support us on Gitcoin 🌱</span>
              </DangerButton>
              <span className="countdown">
                Gitcoin Grants beta round will be ended in
                <br />3 days 5 minutes 3 seconds.
              </span>
            </a>
          </GitcoinGrant>
          {/* <Twitter
          href="https://twitter.com/uniswapdotfish"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faTwitter} />
        </Twitter>
        <Announcement /> */}
        </Menubar>
      </NavbarContainer>
      <div style={{ marginBottom: 20 }}></div>
    </>
  );
};

export default Navbar;
