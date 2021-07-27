import styled from "styled-components";

const ButtonStyle = styled.button`
  border: 0;
  color: #ccc;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  padding: 6px 10px;
  cursor: pointer;
`;

export const Button = styled(ButtonStyle)`
  background: linear-gradient(
    -30deg,
    rgba(34, 36, 41, 0.5),
    rgba(34, 36, 41, 0.7)
  );
  &:hover {
    background: linear-gradient(
      -30deg,
      rgba(34, 36, 41, 0.65),
      rgba(34, 36, 41, 0.9)
    );
    color: white;
  }
`;

export const DangerButton = styled(ButtonStyle)`
  background: linear-gradient(
    -30deg,
    rgba(247, 2, 119, 0.5),
    rgb(247, 2, 119, 0.7)
  );
  &:hover {
    background: linear-gradient(
      -30deg,
      rgba(247, 2, 119, 0.65),
      rgba(247, 2, 119, 0.9)
    );
    color: white;
  }
`;

export const PrimaryButton = styled(ButtonStyle)`
  background: linear-gradient(
    -30deg,
    rgba(34, 114, 229, 0.5),
    rgba(34, 114, 229, 0.7)
  );
  &:hover {
    background: linear-gradient(
      -30deg,
      rgba(34, 114, 229, 0.65),
      rgba(34, 114, 229, 0.9)
    );
    color: white;
  }
`;
export const PrimaryBlockButton = styled(PrimaryButton)`
  color: white;
  width: 100%;
  padding: 15px;

  background: linear-gradient(
    -30deg,
    rgba(34, 114, 229, 0.65),
    rgba(34, 114, 229, 0.9)
  );
  &:hover {
    background: linear-gradient(
      -30deg,
      rgba(34, 114, 229, 0.85),
      rgba(34, 114, 229, 1)
    );
  }
`;
