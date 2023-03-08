import React from "react";
import { Script } from "gatsby";

export function Head() {
  return (
    <>
      <title>Uniswap V3 Fee Calculator - Uniswap.fish</title>
      <meta charSet="utf-8" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Gowun+Batang&family=Noto+Sans+JP:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      />
      <meta
        name="description"
        content="Calculate your Uniswap v3 positions fee returns, APY, APR, ROI, yields, and impermanent loss based on how much pool liquidity you provide."
      />
      <meta name="author" content="Chun Rapeepat" />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content="Uniswap V3 Fee Calculator - Uniswap.fish"
      />
      <meta
        property="og:description"
        content="Calculate your Uniswap v3 positions fee returns, APY, APR, ROI, yields, and impermanent loss based on how much pool liquidity you provide."
      />
      <meta property="og:url" content="https://uniswap.fish" />
      <meta property="og:image" content="https://uniswap.fish/ogimage.jpeg" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@uniswapdotfish" />
      <meta
        name="twitter:title"
        content="Uniswap V3 Fee Calculator - Uniswap.fish"
      />
      <meta
        name="twitter:description"
        content="Calculate your Uniswap v3 positions fee returns, APY, APR, ROI, yields, and impermanent loss based on how much pool liquidity you provide."
      />
      <meta name="twitter:image" content="https://uniswap.fish/ogimage.jpeg" />
      <Script>
        {`var ffWidgetId = "bbf56663-84dc-4b55-bf9c-333b5b4c2720";
    var ffWidgetScript = document.createElement("script");
    ffWidgetScript.type = "text/javascript";
    ffWidgetScript.src = "https://freddyfeedback.com/widget/freddyfeedback.js";
    document.head.appendChild(ffWidgetScript);`}
      </Script>
    </>
  );
}
