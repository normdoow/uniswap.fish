import React from "react";
import styled from "styled-components";
import { Heading } from "../../common/components/atomic";
import { NETWORKS } from "../../common/network";
import { usePoolContext } from "../../context/pool/poolContext";
import { ScreenWidth } from "../../utils/styled";
import TopPoolTable from "./TopPoolTable";

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

const FavoritePools = () => {
  const { state } = usePoolContext();
  const chainId = state.chain?.id || NETWORKS[0].id;
  const favoritePoolIds = state.favoritePoolIds[chainId] || [];
  const pools = state.poolsCache[chainId] || [];
  const tokens = state.tokensCache[chainId] || [];

  return (
    <Container>
      <WrappedHeader>
        <Heading>Favorite Pools</Heading>
        <Total>
          Total: {pools.length > 0 ? favoritePoolIds.length : 0} pools
        </Total>
      </WrappedHeader>

      {(favoritePoolIds.length === 0 || pools.length === 0) && (
        <p style={{ color: "#777", fontSize: "0.875rem", marginTop: 10 }}>
          You don't have any favorite pools yet. Add your favorite pool
          collections by clicking the star icon.
        </p>
      )}
      {favoritePoolIds.length > 0 && pools.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <TopPoolTable
            isLoading={false}
            pools={pools.filter((p) => favoritePoolIds.includes(p.poolId))}
            tokens={tokens}
          />
        </div>
      )}
    </Container>
  );
};

export default FavoritePools;
