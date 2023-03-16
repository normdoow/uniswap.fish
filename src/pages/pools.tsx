import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Footer from "../containers/Footer";
import { DownOutlined } from "@ant-design/icons";
import Navbar from "../containers/navbar/Navbar";
import { ScreenWidth } from "../utils/styled";
import { Br } from "../common/components/atomic";
import FavoritePools from "../containers/pools/FavoritePools";
import TopPools from "../containers/pools/TopPools";
import { Dropdown } from "antd";
import { NETWORKS } from "../common/network";
import {
  favoritePoolIdsLocalStorageKey,
  usePoolContext,
} from "../context/pool/poolContext";
import { PoolActionType } from "../context/pool/poolReducer";
import { getQueryParam, setQueryParam } from "../utils/querystring";
import { Network } from "../common/interfaces/uniswap.interface";
import { SEO } from "../common/components/Head";

const BodyContainer = styled.div`
  max-width: 900px;
  margin: auto;
  padding-top: 100px;

  @media only screen and (max-width: ${ScreenWidth.TABLET}px) {
    margin: auto 15px;
    padding-top: 85px;
  }
`;
const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;

  & h2 {
    font-size: 1.2rem;
    margin: 0;
  }
`;
const NetworkDropdown = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  & img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 7px;
  }
  & svg {
    font-size: 0.875rem;
    margin-left: 7px;
    transform: translateY(2px);
  }
`;
const NetworkDropdownItem = styled.div`
  display: flex;
  align-items: center;

  & img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 15px;
  }
  & .name {
    color: black;
  }
  & .desc {
    color: #555;
    font-size: 0.8rem;
    margin-top: -1px;
  }
`;

function App() {
  const poolContext = usePoolContext();

  useEffect(() => {
    let networkId = getQueryParam("network");
    let network: Network;
    if (!networkId) {
      network = NETWORKS[0];
      setQueryParam("network", network.id);
    } else {
      const _network = NETWORKS.find((network) => network.id === networkId);
      if (_network) {
        network = _network;
      } else {
        network = NETWORKS[0];
        setQueryParam("network", network.id);
      }
    }

    poolContext.dispatch({
      type: PoolActionType.SET_CHAIN,
      payload: network,
    });

    // load favorite pool ids
    poolContext.dispatch({
      type: PoolActionType.INIT_FAVORITE_POOL_IDS,
      payload: JSON.parse(
        localStorage.getItem(favoritePoolIdsLocalStorageKey) || "{}"
      ),
    });
  }, []);

  const items = NETWORKS.filter((network) => !network.disabled).map(
    (network) => {
      return {
        key: network.id,
        label: (
          <NetworkDropdownItem
            key={network.id}
            onClick={() => {
              poolContext.dispatch({
                type: PoolActionType.SET_CHAIN,
                payload: network,
              });

              setQueryParam("network", network.id);
            }}
          >
            <img src={network.logoURI} />
            <div>
              <div className="name">{network.name}</div>
              <div className="desc">{network.desc}</div>
            </div>
          </NetworkDropdownItem>
        ),
      };
    }
  );

  return (
    <>
      <Navbar />
      <BodyContainer>
        <HeaderContainer>
          <h2>Pool Overview</h2>
          {poolContext.state.chain && (
            <Dropdown
              menu={{
                items,
                selectable: true,
                defaultSelectedKeys: [poolContext.state.chain.id],
              }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <NetworkDropdown>
                <img src={poolContext.state.chain.logoURI} />
                <span>{poolContext.state.chain.name}</span>
                <DownOutlined />
              </NetworkDropdown>
            </Dropdown>
          )}
        </HeaderContainer>
        <Br />

        {poolContext.state.chain && (
          <>
            <FavoritePools />
            <Br />
            <TopPools />
          </>
        )}

        <Footer />
      </BodyContainer>
    </>
  );
}

export default App;
export const Head = () => {
  const title = "Uniswap V3 Pool Overview - Uniswap.fish";
  const description =
    "Analyze and get an overview of Uniswap v3 pools on Ethereum, Binance (BSC), Polygon, Arbitrum, Optimism, Celo, and more.";

  return <SEO title={title} description={description} />;
};
