import styled, { keyframes } from "styled-components";
import { ScreenWidth } from "../../utils/styled";

// Section: Button
const ButtonStyle = styled.button`
  border: 0;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  padding: 6px 10px;
  cursor: pointer;
`;
export const FeedbackButton = styled(ButtonStyle)`
  position: fixed;
  right: 30px;
  bottom: 30px;
  z-index: 999;
  color: white;
  background: #ea4c89;

  padding: 0;
  font-size: 1.2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;

  &:hover {
    background: #ea6296;
  }

  @media only screen and (max-width: ${ScreenWidth.TABLET}px) {
    right: 20px;
    bottom: 20px;
  }
`;

export const Button = styled(ButtonStyle)`
  background: rgba(255, 255, 255, 0.1);
  color: white;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;
const DonateButtonAnimation = keyframes`
  0% {
    -webkit-box-shadow: 0px 0px 17px -1px rgba(255,255,255,0); 
    box-shadow: 0px 0px 17px -1px rgba(255,255,255,0);
  }
  50% {
    -webkit-box-shadow: 0px 0px 17px -1px rgba(255,255,255,0.25); 
    box-shadow: 0px 0px 17px -1px rgba(255,255,255,0.5);
    transform: scale(1.05);
  }
  100% {
    -webkit-box-shadow: 0px 0px 17px -1px rgba(255,255,255,0); 
    box-shadow: 0px 0px 17px -1px rgba(255,255,255,0);
  }
`;
export const DangerButton = styled(ButtonStyle)`
  animation: ${DonateButtonAnimation} 2s ease;
  animation-iteration-count: infinite;
  background-image: linear-gradient(
    to bottom right,
    #b827fc 0%,
    #2c90fc 25%,
    #b8fd33 50%,
    #fec837 75%,
    #fd1892 100%
  );
  padding: 4px;

  & > span {
    display: inline-block;
    /* background: radial-gradient(
        174.47% 188.91% at 1.84% 0%,
        rgb(255, 0, 122) 0%,
        rgb(33, 114, 229) 100%
      ),
      rgb(237, 238, 242); */
    border-radius: 8px;
    border: 2px solid #000;
    color: black;
    padding: 3px 8px;
    background: white;
  }
`;
export const PrimaryButton = styled(ButtonStyle)`
  background: #1470f1;
  color: white;
  &:hover {
    background: #2a77fd;
  }
`;
export const PrimaryBlockButton = styled(PrimaryButton)`
  color: white;
  width: 100%;
  padding: 15px;
  display: flex;
  justify-content: center;

  & svg {
    transform: scale(1.5);
  }

  background: #1470f1;
  &:hover {
    background: #2a77fd;
  }
`;
export const PrimaryDarkBlockButton = styled(PrimaryButton)`
  background: rgba(76, 130, 251, 0.24);
  color: rgb(76, 130, 251);

  width: 100%;
  padding: 15px;
  display: flex;
  justify-content: center;

  & svg {
    transform: scale(1.5);
  }

  &:hover {
    background: rgba(76, 130, 251, 0.3);
  }
`;

// Section: Basic HTML tag
export const Heading = styled.h3`
  color: white;
  margin: 0;
  font-size: 1rem;
  margin-bottom: 12px;
  font-weight: 500;
`;
export const H2 = styled.h2`
  color: white;
  margin: 0;
  font-size: 1.2rem;
  margin-bottom: 12px;
  font-weight: 500;
`;
export const Br = styled.div`
  height: 20px;
`;
export const Dollar = styled.span`
  font-family: "Gowun Batang", serif !important;
`;

// Section: Table
export const Table = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 7rem 1fr 5rem;
  grid-gap: 7px;

  padding: 6px 12px;
  margin-top: 7px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #aaa;

  & > div:nth-child(2) {
    text-align: right;
  }
  & > div:nth-child(3n) {
    text-align: left;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 5rem;
    text-align: center;
  }
`;

// Section: Input
export const Group = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 8px;
  border-radius: 12px;
`;
export const InputGroup = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 8px;
  border-radius: 12px;
  margin-top: 2px;
  position: relative;
  & > span {
    font-size: 0.8rem;
    text-align: center;
    color: #999;
    display: block;
    text-align: center;
  }
  & .btn {
    position: absolute;
    color: black;
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    width: 15px;
    height: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    font-weight: bold;
    &:hover {
      background: white;
    }

    @media only screen and (max-width: ${ScreenWidth.TABLET}px) {
      width: 17.5px;
      height: 17.5px;
    }
  }
  & .btn-left {
    & span {
      transform: translate(0, -2px);
    }
  }
  & .btn-right {
    right: 8px;
    & span {
      transform: translate(0.2px, -1px);
    }
  }
`;
export const Input = styled.input`
  display: block;
  width: 100%;
  border: 0;
  background: transparent;
  color: white;
  font-weight: 400;
  font-size: 1.2rem;
  text-align: center;
  margin-top: 3px;

  &:focus {
    outline: none;
  }
`;
