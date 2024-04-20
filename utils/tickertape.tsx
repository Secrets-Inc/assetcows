// TradingViewWidget.jsx
import Link from 'next/link';
import React, { useEffect, useRef, memo } from 'react';

function TickerTape() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
            "symbols": [
                {
                  "description": "USDT",
                  "proName": "CRYPTOCAP:USDT"
                },
                {
                  "description": "USDTUSD",
                  "proName": "COINBASE:USDTUSD"
                },
                {
                  "description": "USDTEUR",
                  "proName": "BITGET:USDTEUR"
                },
                {
                  "description": "USDTGBP",
                  "proName": "COINBASE:USDTGBP"
                },
                {
                  "description": "USDTCAD",
                  "proName": "KRAKEN:USDTCAD"
                },
                {
                  "description": "USDTTRY",
                  "proName": "BINANCE:USDTTRY"
                }
              ],
            "showSymbolLogo":true,
            "isTransparent":false,
            "displayMode":"adaptive",
            "locale":"en",
            "colorTheme": "light"
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
      <div className="tradingview-widget-copyright"><Link href="/" rel="noopener nofollow" target="_blank"><span className="blue-text">By AssetProof</span></Link></div>
    </div>
  );
}

export default memo(TickerTape);
