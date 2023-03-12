import { ConfigProvider, theme, Table as AntdTable } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Heading } from "../../common/components/atomic";
import { Token } from "../../common/interfaces/uniswap.interface";
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
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [pools, setPools] = useState<PoolColumnDataType[]>([]);

  const handleResize = () => {
    if (window.innerWidth <= ScreenWidth.TABLET) {
      setIsTablet(true);
    } else {
      setIsTablet(false);
    }
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

  useEffect(() => {
    setIsLoading(true);
    getPools().then((allPools) => {
      console.log("debug pools", allPools);
      setIsLoading(false);
    });
  }, []);

  const columns: ColumnsType<PoolColumnDataType> = [
    {
      title: "#",
      dataIndex: "positionId",
      key: "positionId",
      width: 110,
      fixed: isTablet ? false : "left",
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
        <Total>Total: 30 pools</Total>
      </WrappedHeader>

      <p style={{ color: "#777", fontSize: "0.875rem", marginTop: 10 }}>
        You don't have any favorite pools yet. Add your favorite pools to this
      </p>

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
