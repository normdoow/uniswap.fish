import styled from "styled-components";
import { ScreenWidth } from "../utils/styled";

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
