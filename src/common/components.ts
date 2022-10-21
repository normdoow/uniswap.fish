import styled from "styled-components";

export const Heading = styled.h3`
  color: white;
  margin: 0;
  font-size: 1rem;
  margin-bottom: 12px;
  font-weight: 500;
`;

export const Br = styled.div`
  height: 20px;
`;

export const Dollar = styled.span`
  font-family: "Gowun Batang", serif;
`;

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
  color: #999;

  & > div:nth-child(2) {
    text-align: right;
  }
  & > div:nth-child(3) {
    text-align: left;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 5rem;
    text-align: center;
  }
`;
