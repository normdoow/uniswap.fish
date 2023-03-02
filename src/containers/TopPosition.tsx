import React, { useEffect, useState } from "react";
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
import { getPoolPositions } from "../repos/uniswap";
import { useAppContext } from "../context/app/appContext";
import { Position } from "../common/interfaces/uniswap.interface";
import { getPriceFromTick } from "../utils/uniswapv3/math";

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
const PriceRange = styled.div`
  position: relative;
  height: 35px;
  margin-bottom: 8px;

  & > .bar {
    width: 100%;
    height: 3px;
    border-radius: 5rem;
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(12.5px);
  }
  & > .lower,
  .upper,
  .price {
    position: absolute;
    width: 5px;
    height: 22px;
    cursor: zoom-in;
    border-top-left-radius: 5rem;
    border-top-right-radius: 5rem;
    border-bottom-left-radius: 5rem;
    border-bottom-right-radius: 5rem;
  }

  & > .lower {
    left: 10px;
    transform: translateX(50%);
    background: #25af60;
  }
  & > .price {
    left: 50%;
    background: #f70377;
    transform: translateX(-50%);
  }
  & > .upper {
    right: 10px;
    transform: translateX(-50%);
    background: #25af60;
  }

  & > .info {
    margin-top: 24px;
    display: flex;
    justify-content: center;
    font-size: 0.675rem;
    color: #999;
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
  isActive: boolean;
  strategy: PositionStrategy;
  roi: number;
  apr: number;
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
    width: 100,
    fixed: "left",
    filters: [
      {
        text: "Active Position",
        value: "isActive",
      },
    ],
    onFilter: (_, record) => record.isActive,
    sorter: (a, b) => Number(a.positionId) - Number(b.positionId),
    render: (positionId, record) => (
      <a
        href={`https://app.uniswap.org/#/pool/${positionId}`}
        target="_blank"
        style={{
          fontWeight: 600,
        }}
      >
        <Badge
          status={record.isActive ? "success" : "default"}
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
  },
  {
    title: "Fee ROI",
    dataIndex: "roi",
    key: "roi",
  },
  {
    title: "Fee APR",
    dataIndex: "apr",
    key: "apr",
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
    width: 100,
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
    width: 250,
    render: (strategy) => (
      <div>
        <PriceRange>
          <div className="bar"></div>
          <div
            style={{ opacity: true ? 0.4 : 1 }}
            className="lower"
            data-for="top-position"
            data-place="right"
            data-html={true}
            // data-tip={
            //   state.isFullRange
            //     ? `Lower Price: 0`
            //     : `Lower Price<br>${round(Pl, 6)} ${state.token0?.symbol}/${
            //         state.token1?.symbol
            //       }<br><br>(Click to copy to clipboard)`
            // }
            // onClick={() =>
            //   state.isFullRange
            //     ? ""
            //     : navigator.clipboard.writeText(`${Pl}`)
            // }
          ></div>
          <div
            style={{ opacity: true ? 0.4 : 1 }}
            className="upper"
            data-for="top-position"
            data-place="left"
            data-html={true}
            // data-tip={
            //   state.isFullRange
            //     ? `Upper Price: ∞`
            //     : `Upper Price<br>${round(Pu, 6)} ${state.token0?.symbol}/${
            //         state.token1?.symbol
            //       }<br><br>(Click to copy to clipboard)`
            // }
            // onClick={() =>
            //   state.isFullRange
            //     ? ""
            //     : navigator.clipboard.writeText(`${Pu}`)
            // }
          ></div>

          <div
            className="price"
            data-for="top-position"
            data-place="bottom"
            data-html={true}
            // data-tip={`Current Price<br>${round(P, 6)} ${
            //   state.token0?.symbol
            // }/${state.token1?.symbol}<br><br>(Click to copy to clipboard)`}
            // onClick={() => navigator.clipboard.writeText(`${P}`)}
          ></div>

          <div className="info">Out of Range</div>
        </PriceRange>
      </div>
    ),
  },
  {
    title: "Age",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 80,
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
    fixed: "right",
    width: 100,
    render: (_, record) => (
      <Button style={{ fontSize: "0.875rem" }}>Apply</Button>
    ),
  },
];

const TopPosition = () => {
  const modalContext = useModalContext();
  const appContext = useAppContext();
  const [positions, setPositions] = useState<PositionColumnDataType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTopPosition = async () => {
    if (!appContext.state.pool) return;
    setIsLoading(true);

    const {
      pool,
      token0PriceChart,
      token1PriceChart,
      token0,
      token1,
      isPairToggled,
    } = appContext.state;
    const token0Price = token0PriceChart?.currentPriceUSD || 0;
    const token1Price = token1PriceChart?.currentPriceUSD || 0;

    const allPositions = await getPoolPositions(pool.id);
    const validPositions = allPositions.filter(
      (p: Position) =>
        Number(p.depositedToken0) * token0Price +
          Number(p.depositedToken1) * token1Price >=
        500
    );

    const topPositions: PositionColumnDataType[] = validPositions.map(
      (p: Position) => {
        // let lowerPrice = getPriceFromTick(
        //   Number(p.tickLower.tickIdx),
        //   token0?.decimals || "18",
        //   token1?.decimals || "18"
        // );
        // let upperPrice = getPriceFromTick(
        //   Number(p.tickUpper.tickIdx),
        //   token0?.decimals || "18",
        //   token1?.decimals || "18"
        // );
        // if (isPairToggled) {
        //   lowerPrice = getPriceFromTick(
        //     -Number(p.tickLower.tickIdx),
        //     token0?.decimals || "18",
        //     token1?.decimals || "18"
        //   );
        //   upperPrice = getPriceFromTick(
        //     -Number(p.tickUpper.tickIdx),
        //     token0?.decimals || "18",
        //     token1?.decimals || "18"
        //   );
        // }
        const lowerTick = Number(p.tickLower.tickIdx);
        const upperTick = Number(p.tickUpper.tickIdx);
        const currentTick = Number(pool.tick);

        const isActive = currentTick >= lowerTick && currentTick <= upperTick;

        return {
          key: p.id,
          positionId: p.id,
          isActive,
          strategy: PositionStrategy.LONG,
          apr: 0,
          roi: 0,
          pnl: 0,
          liquidity: 0,
          priceRange: {
            lower: 0,
            upper: 0,
          },
          createdAt: Number(p.transaction.timestamp) * 1000,
        } as PositionColumnDataType;
      }
    );

    console.log("debug", { topPositions });
    setPositions(topPositions);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTopPosition();
  }, [appContext.state.pool]);

  return (
    <Container>
      <ReactTooltip id="top-position" />
      <WrappedHeader>
        <Heading>Top Positions</Heading>
        <Total>Total: {positions.length} positions</Total>
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
          dataSource={positions}
          scroll={{ x: 1400 }}
          size="middle"
          loading={isLoading}
        />
      </ConfigProvider>
    </Container>
  );
};

export default TopPosition;
