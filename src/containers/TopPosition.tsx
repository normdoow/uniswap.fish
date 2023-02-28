import React from "react";
import styled from "styled-components";
import { Heading } from "../common/components/atomic";
import { useModalContext } from "../context/modal/modalContext";
import { ModalActionType } from "../context/modal/modalReducer";
import { ScreenWidth } from "../utils/styled";
import { Badge, ConfigProvider, Space, Table, Tag, theme } from "antd";
import type { ColumnsType } from "antd/es/table";

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
    render: (text) => (
      <a>
        <Badge status="success" text={text} />
      </a>
    ),
    fixed: "left",
  },
  {
    title: "Strategy",
    dataIndex: "strategy",
    key: "strategy",
  },
  {
    title: "ROI",
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

const data: PositionColumnDataType[] = [
  {
    key: "1",
    positionId: "123456789",
    strategy: PositionStrategy.LONG,
    roi: 0.123,
    pnl: 123.456,
    liquidity: 123456,
    priceRange: {
      lower: 123,
      upper: 456,
    },
    timestamp: 123456789,
  },
];

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
