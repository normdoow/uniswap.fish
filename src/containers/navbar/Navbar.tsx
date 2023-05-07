import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ScreenWidth } from "../../utils/styled";
import Logo from "./Logo";
import Announcement from "./Announcement";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
// import { DangerButton } from "../../common/components/atomic";

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

const Navbar: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Set the end time for the countdown
      const endTime = new Date("2023-05-09T23:59:59");
      const now = new Date();
      const distance = endTime.getTime() - now.getTime();

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
      } else {
        clearInterval(interval);
        return "Countdown has ended";
      }
    };

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <NavbarContainer>
        <Logo />
        <Menubar id="menubar-container">
          {/* <GitcoinGrant>
            <a
              target="_blank"
              href="https://explorer.gitcoin.co/#/round/1/0x12bb5bbbfe596dbc489d209299b8302c3300fa40/0x12bb5bbbfe596dbc489d209299b8302c3300fa40-78"
            >
              <DangerButton>
                <span>Support us on Gitcoin 🌱</span>
              </DangerButton>
              <span className="countdown">
                Gitcoin Grants beta round will be ended in
                <br />
                {timeLeft}.
              </span>
            </a>
          </GitcoinGrant> */}
          <Twitter
            href="https://twitter.com/uniswapdotfish"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faTwitter} />
          </Twitter>
          <Announcement />
        </Menubar>
      </NavbarContainer>
      {/* <div style={{ marginBottom: 20 }}></div> */}
    </>
  );
};

export default Navbar;
