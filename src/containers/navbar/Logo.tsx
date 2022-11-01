import styled from "styled-components";

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

  & img {
    width: 60px;
    transform: translateX(-30%) translateY(3px);
  }
`;

const Logo = () => {
  return (
    <LogoContainer>
      <img src="/logo-only-fish.png" />
    </LogoContainer>
  );
};

export default Logo;
