import styled, { keyframes } from "styled-components";

const ButtonStyle = styled.button`
  border: 0;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  padding: 6px 10px;
  cursor: pointer;
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
    padding: 4px 8px;
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
