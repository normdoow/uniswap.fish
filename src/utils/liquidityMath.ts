// for calculation detail, please visit README.md (Section: Calculation Breakdown, No. 1)
export const getTokenAmountsFromDepositAmounts = (
  P: number,
  Pl: number,
  Pu: number,
  priceUSDX: number,
  priceUSDY: number,
  targetAmounts: number
) => {
  const deltaL =
    targetAmounts /
    ((Math.sqrt(P) - Math.sqrt(Pl)) * priceUSDY +
      (1 / Math.sqrt(P) - 1 / Math.sqrt(Pu)) * priceUSDX);

  let deltaY = deltaL * (Math.sqrt(P) - Math.sqrt(Pl));
  if (deltaY * priceUSDY < 0) deltaY = 0;
  if (deltaY * priceUSDY > targetAmounts) deltaY = targetAmounts / priceUSDY;

  let deltaX = deltaL * (1 / Math.sqrt(P) - 1 / Math.sqrt(Pu));
  if (deltaX * priceUSDX < 0) deltaX = 0;
  if (deltaX * priceUSDX > targetAmounts) deltaX = targetAmounts / priceUSDX;

  return { amount0: deltaX, amount1: deltaY };
};
