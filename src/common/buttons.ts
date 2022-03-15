import styled from "styled-components";

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

export const DangerButton = styled(ButtonStyle)`
  background: radial-gradient(
      174.47% 188.91% at 1.84% 0%,
      rgb(255, 0, 122) 0%,
      rgb(33, 114, 229) 100%
    ),
    rgb(237, 238, 242);
  color: white;
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
