import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { StarOutlined } from "@ant-design/icons";
import {
  ConfigProvider,
  theme,
  Table as AntdTable,
  Tooltip,
  Space,
  Button as AntdButton,
  AutoComplete,
  Checkbox,
  SelectProps,
  Popover,
} from "antd";
import { ColumnsType } from "antd/es/table";
import styled from "styled-components";
import { Button, Heading } from "../../common/components/atomic";
import {
  Pool,
  Token,
  PoolDayData,
} from "../../common/interfaces/uniswap.interface";
import { getPools } from "../../repos/uniswap";
import { ScreenWidth } from "../../utils/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faExchangeAlt,
  faExternalLinkAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { formatAmount, formatDollarAmount } from "../../utils/format";
import { getFeeTierPercentage } from "../../utils/uniswapv3/helper";
import { round } from "../../utils/math";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { getCoingeckoToken } from "../../repos/coingecko";
import {
  estimateFee,
  getLiquidityDelta,
  getPriceFromTick,
  getTokensAmountFromDepositAmountUSD,
} from "../../utils/uniswapv3/math";
import BigNumber from "bignumber.js";

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
const PairToken = styled.div`
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;

  & > div {
    margin-right: 7px;

    & img {
      height: 20px;
      border-radius: 50%;
      transform: translateY(2.5px);
    }
    & img:nth-child(2) {
      margin-left: 0px;
    }
  }

  & h3 {
    margin: 0;
    font-size: 0.875rem;
    display: block;

    & svg {
      color: #999;
      font-size: 0.675rem;
      transform: translateX(7px) translateY(-5px);
    }
  }
`;
const FeePercentage = styled.span`
  font-size: 0.875rem;
  padding: 1px 5px;
  border-radius: 5px;
  font-weight: 400;
  color: #999;
  margin-left: 7px;
  background: rgba(255, 255, 255, 0.15);
`;
export const Table = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 5px;
  margin-top: 7px;

  padding: 6px 12px;
  &.adjust-padding-right {
    padding-right: 6px;
  }
  background: rgba(255, 255, 255, 0.075);
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
const TableToken = styled.div`
  display: flex;
  align-items: center;

  & > img {
    height: 18px;
    width: 18px;
    border-radius: 50%;
    transform: translateX(-5px);
  }
`;
const TokenIcon = styled.div`
  color: white;
  display: flex;
  align-items: center;

  & img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 6px;
  }

  & a {
    color: #777;
    font-size: 0.675rem;
    transform: translateY(-1px);

    & > svg {
      margin-left: 6px;
    }
  }
`;
const CheckList = styled.div`
  margin-top: 7px;

  & > div:nth-child(1) {
    display: flex;
    align-items: center;
    color: #777;
    font-weight: 500;

    & > span:nth-child(1) {
      width: 22px;
    }
  }
  & > div:nth-child(2) {
    margin-left: 22px;
    color: #666;
    font-size: 0.675rem;
  }
`;

enum Risk {
  SAFE = "SAFE",
  LOW_RISK = "LOW RISK",
  HIGH_RISK = "HIGH RISK",
}
interface RiskChecklist {
  lowPoolTVL: boolean;
  lowPoolVolume: boolean;
  highPriceVolatility: boolean;
  lowToken0TVL: boolean;
  lowToken1TVL: boolean;
  lowToken0PoolCount: boolean;
  lowToken1PoolCount: boolean;
}
interface PoolColumnDataType {
  key: string;
  poolId: string;
  feeTier: string;
  token0: Token;
  token1: Token;
  totalValueLockedUSD: number;
  volume24h: number;
  volume7d: number;
  dailyVolumePerTVL: number;
  fee24h: number;
  priceVolatility24HPercentage: number;
  poolDayDatas: PoolDayData[];
  dailyFeesPerTVL: number;
  risk: Risk;
  riskChecklist: RiskChecklist;
  estimatedFee24h: number;
  estimatedFeeToken0: number;
  estimatedFeeToken1: number;
}

const searchTokenResult = (tokens: Token[], query: string) =>
  tokens
    .filter((token) =>
      `${token.symbol.toLocaleLowerCase()}_${token.id}`.includes(query)
    )
    .map((token) => {
      return {
        value: token.id,
        label: (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={token.logoURI}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  marginRight: 8,
                }}
              />
              <b>{token.symbol}</b>
            </div>
            <div style={{ color: "#777" }}>{token.name}</div>
          </div>
        ),
      };
    });
const CandleStickChart = ({ data }: { data: PoolColumnDataType }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPriceToggle, setIsPriceToggle] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  }, []);

  return (
    <div style={{ color: "black" }}>
      <div
        style={{
          color: "white",
          fontWeight: 500,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>
          {isPriceToggle ? data.token1.symbol : data.token0.symbol}/
          {isPriceToggle ? data.token0.symbol : data.token1.symbol} Price Chart
          (14D)
        </span>
        <div
          style={{
            borderRadius: 7,
            background: "rgba(255, 255, 255, 0.25)",
            cursor: "pointer",
            fontSize: "0.875rem",
            width: 22,
            height: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setIsPriceToggle(!isPriceToggle)}
        >
          <FontAwesomeIcon icon={faExchangeAlt} />
        </div>
      </div>

      {isLoading && <div style={{ height: 205, width: 300 }} />}
      {!isLoading && (
        <Chart
          key={`candlestick-chart-${data.poolId}`}
          options={{
            tooltip: {
              custom: function ({ seriesIndex, dataPointIndex, w }) {
                const data: any =
                  w.globals.initialSeries[seriesIndex].data[dataPointIndex];

                return `<div style="padding: 5px">
                <div style="margin-bottom: 5px">${new Date(
                  data.x
                ).toDateString()}</div> 

                <div><b>Open:</b> ${round(data.y[0], 6)}</div>
                <div><b>High:</b> ${round(data.y[1], 6)}</div>
                <div><b>Low:</b> ${round(data.y[2], 6)}</div>
                <div><b>Close:</b> ${round(data.y[3], 6)}</div>
              </div>`;
              },
            },
            chart: {
              toolbar: {
                show: false,
              },
              foreColor: "#999",
            },
            xaxis: {
              type: "datetime",
              tooltip: {
                enabled: false,
              },
            },
            yaxis: {
              show: false,
              tooltip: {
                enabled: true,
              },
            },
          }}
          series={[
            {
              data: data.poolDayDatas.map((d: PoolDayData) => {
                let open = Number(d.open);
                let close = Number(d.close);
                let high = Number(d.high);
                let low = Number(d.low);

                if (isPriceToggle) {
                  open = 1 / Number(d.open);
                  close = 1 / Number(d.close);
                  high = 1 / Number(d.low);
                  low = 1 / Number(d.high);
                }

                return {
                  x: new Date(d.date * 1000),
                  y: [open, high, low, close],
                };
              }),
            },
          ]}
          type="candlestick"
          height={190}
        />
      )}
    </div>
  );
};
const TopPools = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pools, setPools] = useState<PoolColumnDataType[]>([]);
  // Pool filter variables
  const [feeCheckedList, setFeeCheckedList] = useState<CheckboxValueType[]>([]);
  const [tokensSearchOptions, setTokensSearchOptions] = useState<
    SelectProps<object>["options"]
  >([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenSearchText, setTokenSearchText] = useState("");

  const processTopPools = (allPools: Pool[]) => {
    const topPools = allPools.map((pool, index) => {
      // Basic Stats
      const poolDayData7d = pool.poolDayData.slice(0, 7);
      const totalValueLockedUSD = Number(pool.totalValueLockedUSD);
      const volume24h = Number(poolDayData7d[0].volumeUSD);
      const volume7d = poolDayData7d.reduce((acc, cur) => {
        return acc + Number(cur.volumeUSD);
      }, 0);
      const dailyVolumePerTVL = volume7d / 7 / totalValueLockedUSD;
      const fee24h = (volume7d / 7) * getFeeTierPercentage(pool.feeTier);
      const dailyFeesPerTVL = fee24h / totalValueLockedUSD;

      // Price Volatility
      const poolDayData14d = pool.poolDayData;
      const priceVolatility24HPercentage: number =
        poolDayData14d
          .map((d: PoolDayData) => {
            return (100 * (Number(d.high) - Number(d.low))) / Number(d.high);
          })
          .reduce((a, b) => a + b, 0) / 14;
      const poolDayDatas = pool.poolDayData;

      // Risk
      const riskChecklist: RiskChecklist = {
        lowPoolTVL: totalValueLockedUSD < 10000000,
        lowPoolVolume: dailyVolumePerTVL < 0.1,
        highPriceVolatility: priceVolatility24HPercentage > 10,
        lowToken0TVL: Number(pool.token0.totalValueLockedUSD) < 10000000,
        lowToken0PoolCount: pool.token0.poolCount < 5,
        lowToken1TVL: Number(pool.token1.totalValueLockedUSD) < 10000000,
        lowToken1PoolCount: pool.token1.poolCount < 5,
      };
      const riskChecklistCount = Object.values(riskChecklist).filter(
        (v) => v === true
      ).length;
      let risk = Risk.SAFE;
      if (riskChecklistCount >= 1) risk = Risk.LOW_RISK;
      if (riskChecklistCount >= 4) risk = Risk.HIGH_RISK;

      // Estimated Profit
      const P = getPriceFromTick(
        Number(pool.tick),
        pool.token0.decimals,
        pool.token1.decimals
      );
      let Pl = P - (P * priceVolatility24HPercentage) / 100;
      let Pu = P + (P * priceVolatility24HPercentage) / 100;
      const priceUSDX = Number(pool.token1.tokenDayData[0].priceUSD);
      const priceUSDY = Number(pool.token0.tokenDayData[0].priceUSD);
      const depositAmountUSD = 1000;
      const { amount0, amount1 } = getTokensAmountFromDepositAmountUSD(
        P,
        Pl,
        Pu,
        priceUSDX,
        priceUSDY,
        depositAmountUSD
      );
      const deltaL = getLiquidityDelta(
        P,
        Pl,
        Pu,
        amount0,
        amount1,
        Number(pool.token0?.decimals || 18),
        Number(pool.token1?.decimals || 18)
      );
      const L = new BigNumber(pool.liquidity);
      const volume24H = volume24h;
      const feeTier = pool.feeTier;
      const estimatedFee24h =
        P >= Pl && P <= Pu ? estimateFee(deltaL, L, volume24H, feeTier) : 0;

      return {
        key: index.toString(),
        poolId: pool.id,
        feeTier: pool.feeTier,
        token0: pool.token0,
        token1: pool.token1,
        totalValueLockedUSD,
        volume24h,
        volume7d,
        dailyVolumePerTVL,
        fee24h,
        priceVolatility24HPercentage,
        poolDayDatas,
        dailyFeesPerTVL,
        risk,
        riskChecklist,
        estimatedFee24h,
        estimatedFeeToken0: amount1,
        estimatedFeeToken1: amount0,
      } as PoolColumnDataType;
    });
    setPools(topPools);
  };

  useEffect(() => {
    setIsLoading(true);
    getPools().then(({ pools, tokens }) => {
      processTopPools(pools);
      setTokens(tokens);
      setIsLoading(false);
    });
  }, []);

  const isPoolFilterResetDisabled =
    feeCheckedList.length === 0 && !tokenSearchText;
  const handlePoolFilterReset = (clearFilters: () => void) => {
    clearFilters();
    setFeeCheckedList([]);
    setTokenSearchText("");
    setTokensSearchOptions([]);
  };
  const handlePoolFilterOK = (setSelectedKeys: any, confirm: () => void) => {
    if (isPoolFilterResetDisabled) {
      setSelectedKeys([]);
    } else {
      setSelectedKeys([
        JSON.stringify({ fees: feeCheckedList, token: tokenSearchText }),
      ]);
    }
    confirm();
  };
  const handlePoolTokenSearch = (value: string) => {
    setTokenSearchText(value);
    setTokensSearchOptions(
      value ? searchTokenResult(tokens, value.toLocaleLowerCase()) : []
    );
  };
  const columns: ColumnsType<PoolColumnDataType> = [
    {
      title: "",
      dataIndex: "poolId",
      key: "favorite",
      width: 25,
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
      key: "pool",
      width: 180,
      filterDropdown: ({ setSelectedKeys, confirm, clearFilters }) => (
        <div onKeyDown={(e) => e.stopPropagation()}>
          <div
            style={{
              background: "#2c2c2c",
              padding: 8,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          >
            <AutoComplete
              style={{ marginBottom: 8, display: "block" }}
              options={tokensSearchOptions}
              onSearch={handlePoolTokenSearch}
              value={tokenSearchText}
              onSelect={(value: string) => {
                setTokenSearchText(value);
              }}
              placeholder="Search token by symbol or address"
            />

            <Checkbox.Group
              options={[
                { label: "0.01%", value: "100" },
                { label: "0.05%", value: "500" },
                { label: "0.3%", value: "3000" },
                { label: "1%", value: "10000" },
              ]}
              value={feeCheckedList}
              onChange={(list) => {
                setFeeCheckedList(list);
              }}
            />
          </div>
          <Space
            style={{
              padding: 8,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <AntdButton
              onClick={() =>
                clearFilters && handlePoolFilterReset(clearFilters)
              }
              size="small"
              type="text"
              disabled={isPoolFilterResetDisabled}
            >
              Reset
            </AntdButton>

            <AntdButton
              type="primary"
              onClick={() => handlePoolFilterOK(setSelectedKeys, confirm)}
              size="small"
            >
              OK
            </AntdButton>
          </Space>
        </div>
      ),
      onFilter: (value, record) => {
        const { fees, token } = JSON.parse(value as string);

        if (fees.length > 0 && !fees.includes(record.feeTier)) return false;
        if (
          token &&
          !(record.token0.id === token || record.token1.id === token)
        )
          return false;

        return true;
      },
      render: (_, { poolId, feeTier, token0, token1 }) => {
        return (
          <Popover
            placement="right"
            color="rgba(0,0,0,0.875)"
            content={
              <div>
                <div>
                  <TokenIcon>
                    <img src={token0.logoURI} />
                    <b>{token0.symbol}</b>
                    <a
                      target="_blank"
                      href={`https://www.coingecko.com/en/coins/${
                        getCoingeckoToken(token0.id)?.id
                      }`}
                    >
                      <FontAwesomeIcon
                        style={{ marginLeft: 6 }}
                        icon={faExternalLinkAlt}
                      />
                    </a>
                  </TokenIcon>
                  <Table className="adjust-padding-right">
                    <div>
                      <div>Current Price</div>
                      <div></div>
                      <div>
                        {formatDollarAmount(
                          Number(token0.tokenDayData[0].priceUSD)
                        )}
                      </div>
                    </div>
                    <div>
                      <div>TVL</div>
                      <div></div>
                      <div>
                        {formatDollarAmount(Number(token0.totalValueLockedUSD))}
                      </div>
                    </div>
                    <div>
                      <div>Pool Count</div>
                      <div></div>
                      <div>{token0.poolCount}</div>
                    </div>
                  </Table>
                </div>

                <div style={{ marginTop: 16 }}>
                  <TokenIcon>
                    <img src={token1.logoURI} />
                    <b>{token1.symbol}</b>
                    <a
                      target="_blank"
                      href={`https://www.coingecko.com/en/coins/${
                        getCoingeckoToken(token1.id)?.id
                      }`}
                    >
                      <FontAwesomeIcon
                        style={{ marginLeft: 6 }}
                        icon={faExternalLinkAlt}
                      />
                    </a>
                  </TokenIcon>
                  <Table className="adjust-padding-right">
                    <div>
                      <div>Current Price</div>
                      <div></div>
                      <div>
                        {formatDollarAmount(
                          Number(token1.tokenDayData[0].priceUSD)
                        )}
                      </div>
                    </div>
                    <div>
                      <div>TVL</div>
                      <div></div>
                      <div>
                        {formatDollarAmount(Number(token1.totalValueLockedUSD))}
                      </div>
                    </div>
                    <div>
                      <div>Pool Count</div>
                      <div></div>
                      <div>{token1.poolCount}</div>
                    </div>
                  </Table>
                </div>
              </div>
            }
          >
            <PairToken>
              <div>
                <img src={token0?.logoURI} alt={token0?.name} />
                <img src={token1?.logoURI} alt={token1?.name} />
              </div>
              <h3>
                <span>
                  {token0?.symbol}/{token1?.symbol}
                </span>
                <FeePercentage>
                  {feeTier === "100" && <span>0.01%</span>}
                  {feeTier === "500" && <span>0.05%</span>}
                  {feeTier === "3000" && <span>0.3%</span>}
                  {feeTier === "10000" && <span>1%</span>}
                </FeePercentage>
                <a
                  target="_blank"
                  href={`https://info.uniswap.org/#/ethereum/pools/${poolId}`}
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                </a>
              </h3>
            </PairToken>
          </Popover>
        );
      },
    },
    {
      title: "Estimated Fees 24H ($1k)",
      dataIndex: "estimatedFee24h",
      key: "estimatedFee24h",
      width: 140,
      sorter: (a, b) => a.estimatedFee24h - b.estimatedFee24h,
      render: (estimatedFee24h, record) => {
        return (
          <Popover
            placement="right"
            color="rgba(0,0,0,0.875)"
            content={
              <div>
                <div style={{ color: "white", fontWeight: 500 }}>
                  Estimated Fees 24H per $1,000
                </div>
                <Table className="adjust-padding-right">
                  <div>
                    <TableToken>
                      <img
                        alt={record.token0?.name}
                        src={record.token0?.logoURI}
                      />{" "}
                      <span>{record.token0?.symbol}</span>
                    </TableToken>
                    <div>{round(record.estimatedFeeToken0, 6)}</div>
                    <div>
                      {formatDollarAmount(
                        record.estimatedFeeToken0 *
                          Number(record.token0.tokenDayData[0].priceUSD)
                      )}
                    </div>
                  </div>
                  <div>
                    <TableToken>
                      <img
                        alt={record.token1?.name}
                        src={record.token1?.logoURI}
                      />{" "}
                      <span>{record.token1?.symbol}</span>
                    </TableToken>
                    <div>{round(record.estimatedFeeToken1, 6)}</div>
                    <div>
                      {formatDollarAmount(
                        record.estimatedFeeToken1 *
                          Number(record.token1.tokenDayData[0].priceUSD)
                      )}
                    </div>
                  </div>
                </Table>

                <Table className="adjust-padding-right">
                  <div>
                    <div>Weekly</div>
                    <div>{formatDollarAmount(record.estimatedFee24h * 7)}</div>
                    <div>
                      {((100 * (record.estimatedFee24h * 7)) / 1000).toFixed(2)}
                      %
                    </div>
                  </div>
                  <div>
                    <div>Monthly</div>
                    <div>{formatDollarAmount(record.estimatedFee24h * 30)}</div>
                    <div>
                      {((100 * (record.estimatedFee24h * 30)) / 1000).toFixed(
                        2
                      )}
                      %
                    </div>
                  </div>
                  <div>
                    <div>Yearly (APR)</div>
                    <div>
                      {formatDollarAmount(record.estimatedFee24h * 365)}
                    </div>
                    <div>
                      {((100 * (record.estimatedFee24h * 365)) / 1000).toFixed(
                        2
                      )}
                      %
                    </div>
                  </div>
                </Table>
                <div
                  style={{ fontSize: "0.675rem", color: "#777", marginTop: 14 }}
                >
                  Estimated Fees 24H are calculated based on the current
                  <br />
                  liquidity and volume 24H with the price range setting of
                  <br />
                  (current price - volatility 24H, current price + volatility
                  24H)
                </div>
              </div>
            }
          >
            {formatDollarAmount(estimatedFee24h)}
          </Popover>
        );
      },
    },
    {
      title: "Risk",
      dataIndex: "risk",
      key: "risk",
      width: 100,
      filters: [
        {
          text: "SAFE",
          value: "SAFE",
        },
        {
          text: "LOW RISK",
          value: "LOW RISK",
        },
        {
          text: "HIGH RISK",
          value: "HIGH RISK",
        },
      ],
      onFilter: (value, record) => record.risk.includes(String(value)),
      render: (risk, { token0, token1, riskChecklist }) => {
        const CheckListComp = (props: {
          checked: boolean;
          title: string;
          desc: string;
          style?: React.CSSProperties;
        }) => {
          return (
            <CheckList {...props}>
              <div style={{ color: props.checked ? "#fd766c" : "#777" }}>
                <span>
                  <FontAwesomeIcon icon={props.checked ? faCheck : faTimes} />
                </span>
                <span>{props.title}</span>
              </div>
              <div style={{ color: props.checked ? "#ba5851" : "#777" }}>
                {props.desc}
              </div>
            </CheckList>
          );
        };

        return (
          <Popover
            placement="right"
            color="rgba(0,0,0,0.875)"
            content={
              <div>
                <CheckListComp
                  style={{ marginTop: 0 }}
                  checked={riskChecklist.lowPoolTVL}
                  title="Low Pool TVL"
                  desc="Total Value Locked USD < $10m"
                />
                <CheckListComp
                  checked={riskChecklist.lowPoolVolume}
                  title="Low Pool Volume"
                  desc="Volume 24H / TVL < 10%"
                />
                <CheckListComp
                  checked={riskChecklist.highPriceVolatility}
                  title="High Price Volatility"
                  desc="Price Volatility 24H > 10%"
                />
                <CheckListComp
                  checked={riskChecklist.lowToken0TVL}
                  title={`Low Token TVL (${token0.symbol})`}
                  desc="Total Value Locked USD < $10m"
                />
                <CheckListComp
                  checked={riskChecklist.lowToken1TVL}
                  title={`Low Token TVL (${token1.symbol})`}
                  desc="Total Value Locked USD < $10m"
                />
                <CheckListComp
                  checked={riskChecklist.lowToken0PoolCount}
                  title={`Low Token Pool Count (${token0.symbol})`}
                  desc="Related-Pool Count < 5 Pool"
                />
                <CheckListComp
                  checked={riskChecklist.lowToken1PoolCount}
                  title={`Low Token Pool Count (${token1.symbol})`}
                  desc="Related-Pool Count < 5 Pool"
                />
              </div>
            }
          >
            <span style={{ fontStyle: "italic", fontWeight: 500 }}>{risk}</span>
          </Popover>
        );
      },
    },
    {
      title: "Price Volatility 24H",
      dataIndex: "priceVolatility24HPercentage",
      key: "priceVolatility24HPercentage",
      width: 140,
      sorter: (a, b) =>
        a.priceVolatility24HPercentage - b.priceVolatility24HPercentage,
      render: (priceVolatility24HPercentage, record) => {
        const _p = priceVolatility24HPercentage;
        let p = round(_p, 2);
        if (p < 0.1) p = round(_p, 4);
        if (p < 0.001) p = round(_p, 6);

        return (
          <Popover
            placement="right"
            color="rgba(0,0,0,0.875)"
            content={
              <div>
                <CandleStickChart data={record} />
                <div style={{ fontSize: "0.675rem", color: "#777" }}>
                  Price Volatility 24H = 14D average of (high - low) / high
                </div>
              </div>
            }
          >
            {p}%
          </Popover>
        );
      },
    },
    {
      title: "TVL",
      dataIndex: "totalValueLockedUSD",
      key: "totalValueLockedUSD",
      width: 110,
      sorter: (a, b) => a.totalValueLockedUSD - b.totalValueLockedUSD,
      render: (totalValueLockedUSD) => {
        return (
          <Tooltip
            placement="right"
            color="rgba(0,0,0,0.675)"
            overlayStyle={{ whiteSpace: "pre-line" }}
            title={`Total Value Locked\r\n$${round(totalValueLockedUSD, 2)}`}
          >
            {formatDollarAmount(totalValueLockedUSD)}
          </Tooltip>
        );
      },
    },
    {
      title: "24H Fees",
      dataIndex: "fee24h",
      key: "fee24h",
      width: 110,
      sorter: (a, b) => a.fee24h - b.fee24h,
      render: (fee24h) => {
        return (
          <Tooltip
            placement="right"
            color="rgba(0,0,0,0.675)"
            overlayStyle={{ whiteSpace: "pre-line" }}
            title={`7D Average 24H Fees\r\n$${round(fee24h, 2)}`}
          >
            {formatDollarAmount(fee24h)}
          </Tooltip>
        );
      },
    },
    {
      title: "24H Fees / TVL",
      dataIndex: "dailyFeesPerTVL",
      key: "dailyFeesPerTVL",
      width: 120,
      sorter: (a, b) => a.dailyFeesPerTVL - b.dailyFeesPerTVL,
      render: (dailyFeesPerTVL) => {
        const _p = dailyFeesPerTVL * 100;
        let p = round(_p, 2);
        if (p < 0.1) p = round(_p, 4);
        if (p < 0.001) p = round(_p, 6);

        return (
          <Tooltip
            placement="right"
            color="rgba(0,0,0,0.675)"
            overlayStyle={{ whiteSpace: "pre-line" }}
            title={`7D Average 24H Fees / TVL`}
          >
            {p}%
          </Tooltip>
        );
      },
    },
    {
      title: "Volume 24H",
      dataIndex: "volume24h",
      key: "volume24h",
      width: 110,
      sorter: (a, b) => a.volume24h - b.volume24h,
      render: (volume24h) => {
        return (
          <Tooltip
            placement="right"
            color="rgba(0,0,0,0.675)"
            overlayStyle={{ whiteSpace: "pre-line" }}
            title={`Last 24H Volume\r\n$${round(volume24h, 2)}`}
          >
            {formatDollarAmount(volume24h)}
          </Tooltip>
        );
      },
    },
    {
      title: "Volume 7D",
      dataIndex: "volume7d",
      key: "volume7d",
      width: 110,
      sorter: (a, b) => a.volume7d - b.volume7d,
      render: (volume7d) => {
        return (
          <Tooltip
            placement="right"
            color="rgba(0,0,0,0.675)"
            overlayStyle={{ whiteSpace: "pre-line" }}
            title={`Last 7D Volume\r\n$${round(volume7d, 2)}`}
          >
            {formatDollarAmount(volume7d)}
          </Tooltip>
        );
      },
    },
    {
      title: "24H Volume / TVL",
      dataIndex: "dailyVolumePerTVL",
      key: "dailyVolumePerTVL",
      width: 150,
      sorter: (a, b) => a.dailyVolumePerTVL - b.dailyVolumePerTVL,
      render: (dailyVolumePerTVL) => {
        return (
          <Tooltip
            placement="right"
            color="rgba(0,0,0,0.675)"
            overlayStyle={{ whiteSpace: "pre-line" }}
            title={`7D Average 24H Volume / TVL`}
          >
            {(dailyVolumePerTVL * 100).toFixed(2)}%
          </Tooltip>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <a target="_blank" href="/">
          <Button style={{ fontSize: "0.875rem" }}>
            <Tooltip
              placement="right"
              color="rgba(0,0,0,0.675)"
              title={`Go to the Uniswap Calculator`}
            >
              Calculate
            </Tooltip>
          </Button>
        </a>
      ),
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
            scroll={{ x: 2000 }}
            size="middle"
            loading={isLoading}
          />
        </ConfigProvider>
      </div>
    </Container>
  );
};

export default TopPools;
