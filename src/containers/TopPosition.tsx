import React from "react";
import styled from "styled-components";
import { Button, Heading } from "../common/components/atomic";
import { useModalContext } from "../context/modal/modalContext";
import { ModalActionType } from "../context/modal/modalReducer";
import { ScreenWidth } from "../utils/styled";
import { Badge, ConfigProvider, Space, Table, Tag, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { getAge, getReadableDateTime } from "../utils/datetime";
import ReactTooltip from "react-tooltip";

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;

  @media only screen and (max-width: ${ScreenWidth.MOBILE}px) {
    padding: 12px;
    border-radius: 12px;
  }
`;
const WrappedHeader = styled.div`
  display: flex;
  justify-content: space-between;

  & > div {
    transform: translateY(0);
    display: flex;
    align-items: center;
    color: red;
    font-size: 0.8rem;
    color: #999;
    height: 25px;
    padding: 12px;
    border-radius: 5rem;
    background: rgba(255, 255, 255, 0.05);
  }
`;
const Total = styled.div`
  @media only screen and (max-width: ${ScreenWidth.MOBILE}px) {
    display: none;
  }
`;

enum PositionStrategy {
  LONG = "LONG",
  MIDDLE = "MIDDLE",
  SHORT = "SHORT",
}
interface PositionColumnDataType {
  key: string;
  positionId: string;
  strategy: PositionStrategy;
  roi: number;
  pnl: number;
  liquidity: number;
  priceRange: {
    lower: number;
    upper: number;
  };
  createdAt: number;
}
const columns: ColumnsType<PositionColumnDataType> = [
  {
    title: "ID",
    dataIndex: "positionId",
    key: "positionId",
    render: (positionId) => (
      <a
        href={`https://app.uniswap.org/#/pool/${positionId}`}
        target="_blank"
        style={{
          fontWeight: 600,
        }}
      >
        <Badge
          status={Math.random() > 0.5 ? "success" : "default"}
          text={positionId}
        />
        <div
          style={{
            display: "inline-block",
            color: "#999",
            fontSize: "0.6rem",
            position: "relative",
            top: -3,
            marginLeft: 3,
          }}
        >
          <FontAwesomeIcon icon={faExternalLinkAlt} />
        </div>
      </a>
    ),
    fixed: "left",
  },
  {
    title: "Fee ROI",
    dataIndex: "roi",
    key: "roi",
  },
  {
    title: "PnL",
    dataIndex: "pnl",
    key: "pnl",
  },
  {
    title: "Liquidity",
    dataIndex: "liquidity",
    key: "liquidity",
  },
  {
    title: "Strategy",
    dataIndex: "strategy",
    key: "strategy",
    render: (strategy) => (
      <div
        style={{
          fontWeight: 600,
          fontStyle: "italic",
        }}
      >
        {strategy}
      </div>
    ),
  },
  {
    title: "Price Range",
    dataIndex: "priceRange",
    key: "priceRange",
  },
  {
    title: "Age",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (createdAt) => (
      <div
        data-for="top-position"
        data-place="right"
        data-html={true}
        data-tip={`${getReadableDateTime(
          createdAt
        )}<br><br>(click to copy timestamp)`}
        onClick={() => navigator.clipboard.writeText(`${createdAt}`)}
        style={{ cursor: "pointer" }}
      >
        {getAge(createdAt)}
      </div>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Button style={{ fontSize: "0.875rem" }}>Apply</Button>
    ),
  },
];

// generate mock data of PositionColumnDataType
const randomNumber = (digit: number) => {
  let result = "";
  for (let i = 0; i < digit; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
};
const generateMockData = (count: number): PositionColumnDataType[] => {
  const result: PositionColumnDataType[] = [];
  for (let i = 0; i < count; i++) {
    result.push({
      key: i.toString(),
      positionId: `${randomNumber(5)}`,
      strategy:
        Math.random() > 0.33
          ? PositionStrategy.LONG
          : Math.random() > 0.5
          ? PositionStrategy.SHORT
          : PositionStrategy.MIDDLE,
      roi: Math.random() * 100,
      pnl: Math.random() * 100,
      liquidity: Math.round(Math.random() * 100000),
      priceRange: {
        lower: Math.random() * 1000,
        upper: Math.random() * 1000 + 200,
      },
      createdAt: Math.floor(Math.random() * 1000000000),
    });
  }
  return result;
};
const data: PositionColumnDataType[] = generateMockData(100);

const TopPosition = () => {
  const modalContext = useModalContext();

  return (
    <Container>
      <ReactTooltip id="top-position" />
      <WrappedHeader>
        <Heading>Top Positions</Heading>
        <Total>Total: 1250 positions</Total>
      </WrappedHeader>

      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            borderRadius: 6,
            colorBgBase: "#0d0d0d",
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 100 }}
          size="middle"
        />
      </ConfigProvider>
    </Container>
  );
};

export default TopPosition;
