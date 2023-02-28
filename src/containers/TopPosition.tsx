import React from "react";
import styled from "styled-components";
import { Heading } from "../common/components/atomic";
import { useModalContext } from "../context/modal/modalContext";
import { ModalActionType } from "../context/modal/modalReducer";
import { ScreenWidth } from "../utils/styled";
import { Badge, ConfigProvider, Space, Table, Tag, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

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
  timestamp: number;
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
  },
  {
    title: "Price Range",
    dataIndex: "priceRange",
    key: "priceRange",
  },
  {
    title: "Age",
    dataIndex: "timestamp",
    key: "timestamp",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Apply</a>
      </Space>
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
        Math.random() > 0.5 ? PositionStrategy.LONG : PositionStrategy.SHORT,
      roi: Math.random() * 100,
      pnl: Math.random() * 100,
      liquidity: Math.round(Math.random() * 100000),
      priceRange: {
        lower: Math.random() * 1000,
        upper: Math.random() * 1000 + 200,
      },
      timestamp: Math.floor(Math.random() * 1000000000),
    });
  }
  return result;
};
const data: PositionColumnDataType[] = generateMockData(100);

const TopPosition = () => {
  const modalContext = useModalContext();

  return (
    <Container>
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

      {/* <PrimaryDarkBlockButton
        onClick={() => {
          modalContext.dispatch({
            type: ModalActionType.SET_CREATE_POSITION_MODAL_STATE,
            payload: true,
          });
        }}
      >
        Create Position
      </PrimaryDarkBlockButton> */}
    </Container>
  );
};

export default TopPosition;
