import React, { useEffect, useState } from "react";
import { StarOutlined } from "@ant-design/icons";
import { ConfigProvider, theme, Table as AntdTable } from "antd";
import { ColumnsType } from "antd/es/table";
import styled from "styled-components";
import { Heading } from "../../common/components/atomic";
import { Pool, Token } from "../../common/interfaces/uniswap.interface";
import { getPools } from "../../repos/uniswap";
import { ScreenWidth } from "../../utils/styled";

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

interface PoolColumnDataType {
  key: string;
  poolId: string;
  feeTier: string;
  token0: Token;
  token1: Token;
}

const TopPools = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pools, setPools] = useState<PoolColumnDataType[]>([]);

  const processTopPools = (allPools: Pool[]) => {
    const topPools = allPools.map((pool, index) => {
      return {
        key: index.toString(),
        poolId: pool.id,
        feeTier: pool.feeTier,
        token0: pool.token0,
        token1: pool.token1,
      };
    });
    setPools(topPools);
  };

  useEffect(() => {
    setIsLoading(true);
    getPools().then((allPools) => {
      processTopPools(allPools);
      setIsLoading(false);
    });
  }, []);

  const columns: ColumnsType<PoolColumnDataType> = [
    {
      title: "",
      dataIndex: "poolId",
      key: "favorite",
      width: 15,
      fixed: "left",
      render: (poolId) => {
        return (
          <div
            style={{
              cursor: "pointer",
              display: "block",
              fontSize: "1rem",
              textAlign: "center",
            }}
            onClick={() => {
              console.log("favorite", poolId);
            }}
          >
            <StarOutlined />
          </div>
        );
      },
    },
    {
      title: "Pool",
      dataIndex: "positionId",
      key: "positionId",
      width: 110,
      filters: [
        {
          text: "Active Position",
          value: "active",
        },
        {
          text: "Out of Range Position",
          value: "out-of-range",
        },
      ],
      render: () => {
        return <div>Hello There</div>;
      },
    },
    {
      title: "Risk",
      dataIndex: "positionId",
      key: "positionId",
      width: 110,
      filters: [
        {
          text: "Active Position",
          value: "active",
        },
        {
          text: "Out of Range Position",
          value: "out-of-range",
        },
      ],
      render: () => {
        return <div>Hello There</div>;
      },
    },
    {
      title: "Basic Stat",
      dataIndex: "positionId",
      key: "positionId",
      width: 110,
      filters: [
        {
          text: "Active Position",
          value: "active",
        },
        {
          text: "Out of Range Position",
          value: "out-of-range",
        },
      ],
      render: () => {
        return <div>Hello There</div>;
      },
    },
  ];

  return (
    <Container>
      <WrappedHeader>
        <Heading>Top Pools</Heading>
        <Total>Total: {pools.length} pools</Total>
      </WrappedHeader>

      <div
        style={{
          color: "#999",
          marginTop: 10,
          marginBottom: 20,
          fontSize: "0.875rem",
        }}
      >
        We only display pools that meet the requirements of having a total
        locked value ≥ $1m and a trading volume ≥ $500k.
      </div>

      <div style={{ overflow: "hidden", borderRadius: "6px" }}>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              borderRadius: 6,
              colorBgBase: "#0d0d0d",
            },
          }}
        >
          <AntdTable
            columns={columns}
            dataSource={pools}
            scroll={{ x: 1000 }}
            size="middle"
            loading={isLoading}
          />
        </ConfigProvider>
      </div>
    </Container>
  );
};

export default TopPools;
