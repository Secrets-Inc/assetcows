// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from 'react';

function HeatMap() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "dataSource": "CryptoWithoutBTC",
          "blockSize": "market_cap_calc",
          "blockColor": "change",
          "locale": "en",
          "symbolUrl": "",
          "colorTheme": "dark",
          "hasTopBar": false,
          "isDataSetEnabled": false,
          "isZoomEnabled": true,
          "hasSymbolTooltip": true,
          "width": "100%",
          "height": "100%"
        }`;
      container.current?.appendChild(script);
       // Clean up function to remove the script when the component unmounts
       return () => {
        container.current?.removeChild(script);
      };
    }, []); // Empty dependency array ensures this effect runs only once
  

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">By AssetProof</span></a></div>
    </div>
  );
}

export default memo(HeatMap);
