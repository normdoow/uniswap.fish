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
import { formatDollarAmount } from "../utils/format";
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
export const ROITable = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 5px;
  margin-top: 7px;

  padding: 6px 12px;
  &.adjust-padding-right {
    padding-right: 6px;
  }
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #aaa;

  & > div {
    display: grid;
    grid-template-columns: 100px 1fr 6rem;
    grid-gap: 7px;

    & > div:nth-child(2) {
      text-align: right;
    }
    & > div:nth-child(3) {
      text-align: left;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 5rem;
      text-align: center;
    }
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
  hourlyFeeUSD: number;

  // Filtering data
  unclaimedROI: number;
}

const TopPosition = () => {
  const appContext = useAppContext();
  const [allPositions, setAllPositions] = useState<Position[]>([]);
  const [positions, setPositions] = useState<PositionColumnDataType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isTablet, setIsTablet] = useState<boolean>(false);

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

  const columns: ColumnsType<PositionColumnDataType> = [
    {
      title: "ID",
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
      onFilter: (value, record) =>
        (record.isActive ? "active" : "out-of-range").includes(String(value)),
      sorter: (a, b) => Number(a.positionId) - Number(b.positionId),
      render: (positionId, record) => (
        <a
          href={`https://app.uniswap.org/#/pool/${positionId}`}
          target="_blank"
          style={{
            fontWeight: 600,
          }}
        >
          <Tooltip
            placement="right"
            color="rgba(0,0,0,0.675)"
            title={`Switch the network to "${
              getCurrentNetwork().name
            }" before viewing the position`}
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
          </Tooltip>
        </a>
      ),
    },
    {
      title: "ROI",
      dataIndex: "roi",
      key: "roi",
      width: 110,
      sorter: (a, b) => a.roi - b.roi,
      render: (roi, record) => (
        <div>
          <Popover
            placement="right"
            color="rgba(0,0,0,0.875)"
            content={
              <div>
                <div style={{ color: "white" }}>
                  Total fees earned: ${record.totalFeeUSD.toFixed(2)}
                </div>
                {(record.unclaimedFee0 > 0 || record.unclaimedFee1 > 0) && (
                  <ROITable className="adjust-padding-right">
                    <div>
                      <Token>
                        <img
                          alt={appContext.state.token0?.name}
                          src={appContext.state.token0?.logoURI}
                        />{" "}
                        <span>{appContext.state.token0?.symbol}</span>
                      </Token>
                      <div>{round(record.unclaimedFee0, 6)}</div>
                      <div>
                        $
                        {(record.unclaimedFee0 * record.token0Price).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <Token>
                        <img
                          alt={appContext.state.token1?.name}
                          src={appContext.state.token1?.logoURI}
                        />{" "}
                        <span>{appContext.state.token1?.symbol}</span>
                      </Token>
                      <div>{round(record.unclaimedFee1, 6)}</div>
                      <div>
                        $
                        {(record.unclaimedFee1 * record.token1Price).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div>Unclaimed Fee</div>
                      <div></div>
                      <div>
                        $
                        {(
                          record.unclaimedFee0 * record.token0Price +
                          record.unclaimedFee1 * record.token1Price
                        ).toFixed(2)}
                      </div>
                    </div>
                  </ROITable>
                )}

                {(record.claimedFee0 > 0 || record.claimedFee1 > 0) && (
                  <ROITable className="adjust-padding-right">
                    <div>
                      <Token>
                        <img
                          alt={appContext.state.token0?.name}
                          src={appContext.state.token0?.logoURI}
                        />{" "}
                        <span>{appContext.state.token0?.symbol}</span>
                      </Token>
                      <div>{round(record.claimedFee0, 6)}</div>
                      <div>
                        ${(record.claimedFee0 * record.token0Price).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <Token>
                        <img
                          alt={appContext.state.token1?.name}
                          src={appContext.state.token1?.logoURI}
                        />{" "}
                        <span>{appContext.state.token1?.symbol}</span>
                      </Token>
                      <div>{round(record.claimedFee1, 6)}</div>
                      <div>
                        ${(record.claimedFee1 * record.token1Price).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div>Claimed Fee</div>
                      <div></div>
                      <div>
                        $
                        {(
                          record.claimedFee0 * record.token0Price +
                          record.claimedFee1 * record.token1Price
                        ).toFixed(2)}
                      </div>
                    </div>
                  </ROITable>
                )}

                <div
                  style={{ fontSize: "0.675rem", color: "#777", marginTop: 14 }}
                >
                  ROI = Total Fee Earned / Total Liquidity
                </div>
              </div>
            }
          >
            {roi.toFixed(2)}%
          </Popover>
        </div>
      ),
    },
    {
      title: "Fee APR",
      dataIndex: "apr",
      key: "apr",
      width: 110,
      sorter: (a, b) => a.apr - b.apr,
      render: (apr, record) => (
        <div>
          <Popover
            placement="right"
            color="rgba(0,0,0,0.875)"
            content={
              <div>
                <Table style={{ marginTop: 0 }}>
                  <div>DAILY</div>
                  <div>${(record.hourlyFeeUSD * 24).toFixed(2)}</div>
                  <div>
                    {(
                      (100 * (record.hourlyFeeUSD * 24)) /
                      record.liquidity
                    ).toFixed(2)}{" "}
                    {`%`}
                  </div>
                </Table>
                <Table>
                  <div>MONTHLY</div>
                  <div>${(record.hourlyFeeUSD * 24 * 30).toFixed(2)}</div>
                  <div>
                    {(
                      (100 * (record.hourlyFeeUSD * 24 * 30)) /
                      record.liquidity
                    ).toFixed(2)}{" "}
                    {`%`}
                  </div>
                </Table>
                <Table>
                  <div>YEARLY (APR)</div>
                  <div>${(record.hourlyFeeUSD * 24 * 365).toFixed(2)}</div>
                  <div>
                    {(
                      (100 * (record.hourlyFeeUSD * 24 * 365)) /
                      record.liquidity
                    ).toFixed(2)}{" "}
                    {`%`}
                  </div>
                </Table>

                <div
                  style={{ fontSize: "0.675rem", color: "#777", marginTop: 14 }}
                >
                  Fee APR = 365 * Daily Total Fee Earned / Total Liquidity
                </div>
              </div>
            }
          >
            {apr.toFixed(2)}%
          </Popover>
        </div>
      ),
    },
    {
      title: "Liquidity",
      dataIndex: "liquidity",
      key: "liquidity",
      width: 150,
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
            {formatDollarAmount(round(liquidity, 2))}
          </Popover>
        </div>
      ),
    },
    {
      title: "Strategy",
      dataIndex: "strategy",
      key: "strategy",
      width: 110,
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
            <Popover
              placement="right"
              color="rgba(0,0,0,0.875)"
              content={
                <div>
                  Price Range {symbol} {round(amount, 6)} {currency}
                  <div
                    style={{
                      fontSize: "0.675rem",
                      color: "#777",
                      marginTop: 14,
                    }}
                  >
                    Strategy is calculated based on the price
                    <br />
                    fluctuation over the past 30 days.
                  </div>
                </div>
              }
            >
              {strategy}
            </Popover>
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
              <Tooltip
                placement="right"
                color="rgba(0,0,0,0.675)"
                overlayStyle={{ whiteSpace: "pre-line" }}
                title={`Lower Price\r\n${round(priceRange.lower, 6)} ${
                  appContext.state.token0?.symbol
                }/${
                  appContext.state.token1?.symbol
                }\r\n\r\n(click to copy the price)`}
              >
                <div
                  style={{
                    opacity: isActive ? 1 : 0.6,
                    ...(!isActive ? { left: "20%" } : {}),
                  }}
                  className="lower"
                  onClick={() =>
                    navigator.clipboard.writeText(`${priceRange.lower}`)
                  }
                ></div>
              </Tooltip>
              <Tooltip
                placement="right"
                color="rgba(0,0,0,0.675)"
                overlayStyle={{ whiteSpace: "pre-line" }}
                title={`Upper Price\r\n${round(priceRange.upper, 6)} ${
                  appContext.state.token0?.symbol
                }/${
                  appContext.state.token1?.symbol
                }\r\n\r\n(click to copy the price)`}
              >
                <div
                  style={{
                    opacity: isActive ? 1 : 0.6,
                    ...(!isActive ? { right: "20%" } : {}),
                  }}
                  className="upper"
                  onClick={() =>
                    navigator.clipboard.writeText(`${priceRange.upper}`)
                  }
                ></div>
              </Tooltip>

              {isActive && (
                <Tooltip
                  placement="right"
                  color="rgba(0,0,0,0.675)"
                  overlayStyle={{ whiteSpace: "pre-line" }}
                  title={`Current Price\r\n${round(priceRange.current, 6)} ${
                    appContext.state.token0?.symbol
                  }/${
                    appContext.state.token1?.symbol
                  }\r\n\r\n(click to copy the price)`}
                >
                  <div
                    className="price"
                    onClick={() =>
                      navigator.clipboard.writeText(`${priceRange.current}`)
                    }
                  ></div>
                </Tooltip>
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
      defaultSortOrder: "descend",
      sorter: (a, b) => Number(a.createdAt) - Number(b.createdAt),
      render: (createdAt) => (
        <div onClick={() => navigator.clipboard.writeText(`${createdAt}`)}>
          <Tooltip
            placement="right"
            color="rgba(0,0,0,0.675)"
            overlayStyle={{ whiteSpace: "pre-line" }}
            title={`${getReadableDateTime(
              createdAt
            )}\r\n(click to copy timestamp)`}
          >
            {getAge(createdAt)}
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: isTablet ? false : "right",
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

            // Plausible Feature Tracking
            const props = {
              featureId: "Top Positions Apply",
            };
            if (typeof window.plausible !== "undefined") {
              window.plausible("FeatureUsage", {
                props,
              });
            }
          }}
        >
          <Tooltip
            placement="right"
            color="rgba(0,0,0,0.675)"
            title={`Apply this position's price range to the setting`}
          >
            Apply
          </Tooltip>
        </Button>
      ),
    },
  ];

  const processTopPositions = (allPositions: Position[]) => {
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

    if (!pool) return;

    const currentTick = Number(pool.tick);
    let currentPrice = getPriceFromTick(
      currentTick,
      token0?.decimals || "18",
      token1?.decimals || "18"
    );
    if (isPairToggled) {
      currentPrice = getPriceFromTick(
        -currentTick,
        token0?.decimals || "18",
        token1?.decimals || "18"
      );
    }

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
        if (isPairToggled) {
          lowerPrice = getPriceFromTick(
            -lowerTick,
            token0?.decimals || "18",
            token1?.decimals || "18"
          );
          upperPrice = getPriceFromTick(
            -upperTick,
            token0?.decimals || "18",
            token1?.decimals || "18"
          );
        }

        // Calculate isActive
        const isActive = currentTick >= lowerTick && currentTick <= upperTick;
        // Calculate createdAt
        const createdAt = Number(p.transaction.timestamp) * 1000;
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
        const token0Amount = isPairToggled ? amount1 : amount0;
        const token1Amount = isPairToggled ? amount0 : amount1;
        const liquidity =
          token0Amount * token0Price + token1Amount * token1Price;
        // Calculate earning fee
        const claimedFee0 = isPairToggled
          ? Number(p.collectedFeesToken1)
          : Number(p.collectedFeesToken0);
        const claimedFee1 = isPairToggled
          ? Number(p.collectedFeesToken0)
          : Number(p.collectedFeesToken1);
        const unclaimedFees = calculatePositionFees(
          pool,
          p,
          isPairToggled ? token1 : token0,
          isPairToggled ? token0 : token1
        );
        const unclaimedFee0 = isPairToggled
          ? unclaimedFees[1]
          : unclaimedFees[0];
        const unclaimedFee1 = isPairToggled
          ? unclaimedFees[0]
          : unclaimedFees[1];
        const totalFee0 = claimedFee0 + unclaimedFee0;
        const totalFee1 = claimedFee1 + unclaimedFee1;
        const totalFeeUSD = totalFee0 * token0Price + totalFee1 * token1Price;
        const roi = 100 * (totalFeeUSD / liquidity);
        // Calculate APR
        const ageInHours = (Date.now() - createdAt) / 1000 / 60 / 60;
        const hourlyFeeUSD = totalFeeUSD / ageInHours;
        const apr = (hourlyFeeUSD * 24 * 365 * 100) / liquidity;
        // Calculate strategy
        let strategy = PositionStrategy.LONG;
        if (upperPrice - lowerPrice <= maxDailyPriceFluctuation) {
          strategy = PositionStrategy.SHORT;
        } else if (upperPrice - lowerPrice <= maxWeeklyPriceFluctuation) {
          strategy = PositionStrategy.MIDDLE;
        }
        // unclaimedROI, use to filter out outliers
        const unclaimedROI =
          (100 * (unclaimedFee0 * token0Price + unclaimedFee1 * token1Price)) /
          liquidity;

        return {
          key: p.id,
          positionId: p.id,
          isActive,
          roi,
          apr,
          strategy,
          liquidity,
          priceRange: {
            lower: lowerPrice,
            upper: upperPrice,
            current: currentPrice,
          },
          createdAt,

          maxDailyPriceFluctuation,
          maxWeeklyPriceFluctuation,
          token0Amount,
          token1Amount,
          token0Price,
          token1Price,
          totalFeeUSD,
          claimedFee0,
          claimedFee1,
          unclaimedFee0,
          unclaimedFee1,
          hourlyFeeUSD,

          unclaimedROI,
        } as PositionColumnDataType;
      }
    );

    let validTopPositions = topPositions
      .sort((a, b) => b.createdAt - a.createdAt)
      .filter(
        (p) =>
          p.liquidity >= 500 && p.roi > 0 && Date.now() - p.createdAt >= 3600000
      )
      .filter(
        // filter out positions that ROI is greater than 100,000% (high possiblity of wrong data)
        (p) => p.roi <= 100000
      )
      .filter(
        // filter out positions that unclaimedFee < 0 (high possiblity of wrong data)
        (p) => p.unclaimedFee0 >= 0 && p.unclaimedFee1 >= 0
      );

    // filter out outliers (unclaimedROI > 5 * average consecutive unclaimedROI)
    const unclaimedROIs = validTopPositions.map((p) => p.unclaimedROI);
    const consecutive = 7;
    const averageUnclaimedROIs: number[] = [];
    for (let i = 0; i < unclaimedROIs.length; i++) {
      const consecutiveUnclaimedROIsAfter = unclaimedROIs.slice(
        Math.min(i + 1, unclaimedROIs.length - 1),
        Math.min(i + consecutive + 1, unclaimedROIs.length - 1)
      );
      const consecutiveUnclaimedROIsBefore = unclaimedROIs.slice(
        Math.max(i - consecutive - 1, 0),
        Math.max(i - 1, 0)
      );
      const consecutiveUnclaimedROIs = [
        ...consecutiveUnclaimedROIsAfter,
        ...consecutiveUnclaimedROIsBefore,
      ];

      const averageUnclaimedROI =
        consecutiveUnclaimedROIs.reduce((a, b) => a + b, 0) /
        consecutiveUnclaimedROIs.length;
      averageUnclaimedROIs.push(averageUnclaimedROI);
    }

    setPositions(
      validTopPositions.filter(
        (p, i) => p.unclaimedROI / averageUnclaimedROIs[i] <= 5
      )
    );
  };

  useEffect(() => {
    if (!appContext.state.pool) return;

    setIsLoading(true);
    getPoolPositions(appContext.state.pool.id).then((allPositions) => {
      processTopPositions(allPositions);
      setAllPositions(allPositions);
      setIsLoading(false);
    });
  }, [appContext.state?.pool?.id]);

  useEffect(() => {
    setIsLoading(true);
    processTopPositions(allPositions);
    setIsLoading(false);
  }, [appContext.state.isPairToggled]);

  return (
    <Container>
      <WrappedHeader>
        <Heading>Top Positions</Heading>
        <Total>Total: {positions.length} positions</Total>
      </WrappedHeader>

      {contextHolder}

      <div
        style={{
          color: "#999",
          marginTop: 10,
          marginBottom: 20,
          fontSize: "0.875rem",
        }}
      >
        We only display positions that meet the requirements of having pooled
        assets of at least $500 and being more than one hour old.
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
            dataSource={positions}
            scroll={{ x: 1000 }}
            size="middle"
            loading={isLoading}
          />
        </ConfigProvider>
      </div>
    </Container>
  );
};

export default TopPosition;
