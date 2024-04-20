// TradingViewWidget.jsx
import Link from 'next/link';
import React, { useEffect, useRef, memo } from 'react';

function MiniChart({ symbol }: { symbol: string }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
            "symbol": "${symbol}",
            "width": "100%",
            "height":"220",
            "autosize":false,
            "isTransparent":false,
            "dateRange": "12M",
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
    <div className="tradingview-widget-container"  style={{ width: '100%', height: '100%' }} ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright"><Link href="/" rel="noopener nofollow" target="_blank"><span className="blue-text">By AssetProof</span></Link></div>
    </div>
  );
}

export default memo(MiniChart);

