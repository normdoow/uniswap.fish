import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined, StarOutlined } from "@ant-design/icons";
import {
  ConfigProvider,
  theme,
  Table as AntdTable,
  Tooltip,
  InputRef,
  Input,
  Space,
  Button,
  AutoComplete,
  Checkbox,
  Row,
  Col,
  SelectProps,
} from "antd";
import { ColumnsType } from "antd/es/table";
import styled from "styled-components";
import { Heading } from "../../common/components/atomic";
import { Pool, Token } from "../../common/interfaces/uniswap.interface";
import { getPools } from "../../repos/uniswap";
import { ScreenWidth } from "../../utils/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { formatDollarAmount } from "../../utils/format";
import { getFeeTierPercentage } from "../../utils/uniswapv3/helper";
import { round } from "../../utils/math";
import { CheckboxValueType } from "antd/es/checkbox/Group";

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
const PairToken = styled.a`
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;

  &:hover {
    opacity: 0.8;
    color: white;
  }

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
      // average poolDayData
      const totalValueLockedUSD = Number(pool.totalValueLockedUSD);
      const volume24h = Number(pool.poolDayData[0].volumeUSD);
      const volume7d = pool.poolDayData.reduce((acc, cur) => {
        return acc + Number(cur.volumeUSD);
      }, 0);
      const dailyVolumePerTVL = volume7d / 7 / totalValueLockedUSD;
      const fee24h = (volume7d / 7) * getFeeTierPercentage(pool.feeTier);

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
      };
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
              placeholder="Search token"
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
            <Button
              onClick={() =>
                clearFilters && handlePoolFilterReset(clearFilters)
              }
              size="small"
              type="text"
              disabled={isPoolFilterResetDisabled}
            >
              Reset
            </Button>

            <Button
              type="primary"
              onClick={() => handlePoolFilterOK(setSelectedKeys, confirm)}
              size="small"
            >
              OK
            </Button>
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
      render: (_, { feeTier, token0, token1 }) => {
        return (
          <PairToken target="_blank" href={`/`}>
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
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </h3>
          </PairToken>
        );
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
            scroll={{ x: 1200 }}
            size="middle"
            loading={isLoading}
          />
        </ConfigProvider>
      </div>
    </Container>
  );
};

export default TopPools;
