import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Heading } from "../common/components/atomic";
import { ScreenWidth } from "../utils/styled";
import {
  Badge,
  ConfigProvider,
  message,
  Popover,
  Table as AntdTable,
  theme,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { getAge, getReadableDateTime } from "../utils/datetime";
import ReactTooltip from "react-tooltip";
import { getPoolPositions } from "../repos/uniswap";
import { useAppContext } from "../context/app/appContext";
import { Position } from "../common/interfaces/uniswap.interface";
import {
  calculatePositionFees,
  getPriceFromTick,
} from "../utils/uniswapv3/math";
import {
  groupPricePointsMinMaxByDay,
  groupPricePointsMinMaxByWeek,
  processPriceChartData,
  round,
} from "../utils/math";
import { formatNumberToUSD } from "../utils/format";
import { AppActionType } from "../context/app/appReducer";
import { Position as V3Position, Pool as V3Pool } from "@uniswap/v3-sdk";
import { Token as V3Token } from "@uniswap/sdk-core";
import { getCurrentNetwork } from "../common/network";
import { Table } from "../common/components/atomic";

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
const Token = styled.div`
  display: flex;
  align-items: center;

  & > img {
    height: 18px;
    width: 18px;
    border-radius: 50%;
    transform: translateX(-5px);
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
    current: number;
  };
  createdAt: number;

  // Additional data
  maxDailyPriceFluctuation: number;
  maxWeeklyPriceFluctuation: number;
  token0Amount: number;
  token1Amount: number;
  token0Price: number;
  token1Price: number;
  totalFeeUSD: number;
  claimedFee0: number;
  claimedFee1: number;
  unclaimedFee0: number;
  unclaimedFee1: number;
}

const TopPosition = () => {
  const appContext = useAppContext();
  const [positions, setPositions] = useState<PositionColumnDataType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const columns: ColumnsType<PositionColumnDataType> = [
    {
      title: "ID",
      dataIndex: "positionId",
      key: "positionId",
      width: 110,
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
      sorter: (a, b) => a.roi - b.roi,
      render: (roi, record) => <div>{roi.toFixed(2)}%</div>,
    },
    {
      title: "Fee APR",
      dataIndex: "apr",
      key: "apr",
      sorter: (a, b) => a.apr - b.apr,
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
      width: 160,
      sorter: (a, b) => a.liquidity - b.liquidity,
      render: (liquidity, record) => (
        <div>
          <Popover
            placement="right"
            color="rgba(0,0,0,0.875)"
            content={
              <div>
                {" "}
                <Table style={{ marginTop: 0 }}>
                  <Token>
                    <img
                      alt={appContext.state.token0?.name}
                      src={appContext.state.token0?.logoURI}
                    />{" "}
                    <span>{appContext.state.token0?.symbol}</span>
                  </Token>
                  <div>{record.token0Amount}</div>
                  <div>
                    ${(record.token0Amount * record.token0Price).toFixed(2)}
                  </div>
                </Table>
                <Table>
                  <Token>
                    <img
                      alt={appContext.state.token1?.name}
                      src={appContext.state.token1?.logoURI}
                    />{" "}
                    <span>{appContext.state.token1?.symbol}</span>
                  </Token>
                  <div>{record.token1Amount}</div>
                  <div>
                    ${(record.token1Amount * record.token1Price).toFixed(2)}
                  </div>
                </Table>
              </div>
            }
          >
            ${formatNumberToUSD(round(liquidity, 2))}
          </Popover>
        </div>
      ),
    },
    {
      title: "Strategy",
      dataIndex: "strategy",
      key: "strategy",
      width: 120,
      filters: [
        {
          text: "SHORT",
          value: "SHORT",
        },
        {
          text: "MIDDLE",
          value: "MIDDLE",
        },
        {
          text: "LONG",
          value: "LONG",
        },
      ],
      onFilter: (value, record) => record.strategy.includes(String(value)),
      render: (strategy, record) => {
        const currency = `${appContext.state.token0?.symbol}/${appContext.state.token1?.symbol}`;
        const amount =
          strategy === PositionStrategy.LONG ||
          strategy === PositionStrategy.MIDDLE
            ? record.maxWeeklyPriceFluctuation
            : record.maxDailyPriceFluctuation;
        const symbol = strategy === PositionStrategy.LONG ? ">" : "≤";

        return (
          <div
            style={{
              fontWeight: 600,
              fontStyle: "italic",
            }}
          >
            <Tooltip
              placement="right"
              color="rgba(0,0,0,0.675)"
              title={`Price Range ${symbol} ${round(amount, 6)} ${currency}`}
            >
              {strategy}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Price Range",
      dataIndex: "priceRange",
      key: "priceRange",
      width: 250,
      render: (priceRange, record) => {
        const isActive = record.isActive;

        return (
          <div>
            <PriceRange>
              <div className="bar"></div>
              <div
                style={{
                  opacity: isActive ? 1 : 0.6,
                  ...(!isActive ? { left: "20%" } : {}),
                }}
                className="lower"
                data-for="top-position_price_range"
                data-place="right"
                data-html={true}
                data-tip={`Lower Price<br>${round(priceRange.lower, 6)} ${
                  appContext.state.token0?.symbol
                }/${
                  appContext.state.token1?.symbol
                }<br><br>(click to copy to clipboard)`}
                onClick={() =>
                  navigator.clipboard.writeText(`${priceRange.lower}`)
                }
              ></div>
              <div
                style={{
                  opacity: isActive ? 1 : 0.6,
                  ...(!isActive ? { right: "20%" } : {}),
                }}
                className="upper"
                data-for="top-position_price_range"
                data-place="right"
                data-html={true}
                data-tip={`Upper Price<br>${round(priceRange.upper, 6)} ${
                  appContext.state.token0?.symbol
                }/${
                  appContext.state.token1?.symbol
                }<br><br>(click to copy to clipboard)`}
                onClick={() =>
                  navigator.clipboard.writeText(`${priceRange.upper}`)
                }
              ></div>

              {isActive && (
                <div
                  className="price"
                  data-for="top-position_price_range"
                  data-place="right"
                  data-html={true}
                  data-tip={`Current Price<br>${round(priceRange.current, 6)} ${
                    appContext.state.token0?.symbol
                  }/${
                    appContext.state.token1?.symbol
                  }<br><br>(click to copy to clipboard)`}
                  onClick={() =>
                    navigator.clipboard.writeText(`${priceRange.current}`)
                  }
                ></div>
              )}

              <div className="info">Hover to see price range info</div>
            </PriceRange>
          </div>
        );
      },
    },
    {
      title: "Age",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 80,
      sorter: (a, b) => Number(a.createdAt) - Number(b.createdAt),
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
        <Button
          style={{ fontSize: "0.875rem" }}
          onClick={() => {
            appContext.dispatch({
              type: AppActionType.UPDATE_PRICE_RANGE,
              payload: [record.priceRange.lower, record.priceRange.upper],
            });
            messageApi.open({
              type: "success",
              content: `Price range setting has been updated`,
            });
          }}
        >
          Apply
        </Button>
      ),
    },
  ];

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

    const currentTick = Number(pool.tick);
    let currentPrice = getPriceFromTick(
      currentTick,
      token0?.decimals || "18",
      token1?.decimals || "18"
    );

    // calculate strategy based on price fluctuation
    const priceDataPoints = processPriceChartData(
      token0PriceChart,
      token1PriceChart
    );
    // Strategy short = 1d, calculate max daily price fluctuation
    const dailyPricePoints = groupPricePointsMinMaxByDay(priceDataPoints);
    const maxDailyPriceFluctuation =
      dailyPricePoints.reduce((acc, cur) => {
        const priceFluctuation = cur.max - cur.min;
        if (priceFluctuation > acc) {
          return priceFluctuation;
        }
        return acc;
      }, 0) * 1.1;
    // Strategy middle = 1w, calculate max weekly price fluctuation
    const weeklyPricePoints = groupPricePointsMinMaxByWeek(priceDataPoints);
    const maxWeeklyPriceFluctuation =
      weeklyPricePoints.reduce((acc, cur) => {
        const priceFluctuation = cur.max - cur.min;
        if (priceFluctuation > acc) {
          return priceFluctuation;
        }
        return acc;
      }, 0) * 1.1;

    const topPositions: PositionColumnDataType[] = allPositions.map(
      (p: Position) => {
        const lowerTick = Number(p.tickLower.tickIdx);
        const upperTick = Number(p.tickUpper.tickIdx);

        let lowerPrice = getPriceFromTick(
          upperTick,
          token0?.decimals || "18",
          token1?.decimals || "18"
        );
        let upperPrice = getPriceFromTick(
          lowerTick,
          token0?.decimals || "18",
          token1?.decimals || "18"
        );
        // if (isPairToggled) {
        //   lowerPrice = getPriceFromTick(
        //     -lowerTick,
        //     token0?.decimals || "18",
        //     token1?.decimals || "18"
        //   );
        //   upperPrice = getPriceFromTick(
        //     -upperTick,
        //     token0?.decimals || "18",
        //     token1?.decimals || "18"
        //   );
        // }

        // Calculate isActive
        const isActive = currentTick >= lowerTick && currentTick <= upperTick;
        // Calculate liquidity
        const network = getCurrentNetwork();
        const tokenA = new V3Token(
          network.chainId,
          token0?.id || "",
          Number(token0?.decimals)
        );
        const tokenB = new V3Token(
          network.chainId,
          token1?.id || "",
          Number(token1?.decimals)
        );
        const v3Pool = new V3Pool(
          tokenA,
          tokenB,
          Number(pool.feeTier),
          pool.sqrtPrice,
          pool.liquidity,
          Number(pool.tick)
        );
        const position = new V3Position({
          pool: v3Pool,
          liquidity: p.liquidity,
          tickLower: lowerTick,
          tickUpper: upperTick,
        });
        const amount0 = Number(position.amount0.toSignificant(4));
        const amount1 = Number(position.amount1.toSignificant(4));
        const liquidity = amount0 * token0Price + amount1 * token1Price;
        // Calculate earning fee
        const claimedFee0 = Number(p.collectedFeesToken0);
        const claimedFee1 = Number(p.collectedFeesToken1);
        const [unclaimedFee0, unclaimedFee1] = calculatePositionFees(
          pool,
          p,
          token0,
          token1
        );
        const totalFee0 = claimedFee0 + unclaimedFee0;
        const totalFee1 = claimedFee1 + unclaimedFee1;
        const totalFeeUSD = totalFee0 * token0Price + totalFee1 * token1Price;
        const roi = 100 * (totalFeeUSD / liquidity);

        // Calculate strategy
        let strategy = PositionStrategy.LONG;
        if (upperPrice - lowerPrice <= maxDailyPriceFluctuation) {
          strategy = PositionStrategy.SHORT;
        } else if (upperPrice - lowerPrice <= maxWeeklyPriceFluctuation) {
          strategy = PositionStrategy.MIDDLE;
        }

        return {
          key: p.id,
          positionId: p.id,
          isActive,
          roi,
          apr: 0,
          pnl: 0,
          strategy,
          liquidity,
          priceRange: {
            lower: lowerPrice,
            upper: upperPrice,
            current: currentPrice,
          },
          createdAt: Number(p.transaction.timestamp) * 1000,

          maxDailyPriceFluctuation,
          maxWeeklyPriceFluctuation,
          token0Amount: amount0,
          token1Amount: amount1,
          token0Price,
          token1Price,
          totalFeeUSD,
          claimedFee0,
          claimedFee1,
          unclaimedFee0,
          unclaimedFee1,
        } as PositionColumnDataType;
      }
    );

    setPositions(topPositions.filter((p) => p.liquidity >= 500));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTopPosition();
  }, [appContext.state.pool]);

  return (
    <Container>
      <WrappedHeader>
        <Heading>Top Positions</Heading>
        <Total>Total: {positions.length} positions</Total>
      </WrappedHeader>

      {contextHolder}
      {positions.length > 0 && <ReactTooltip id="top-position" />}
      {positions.length > 0 && <ReactTooltip id="top-position_price_range" />}

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
