import type { NextPage } from 'next';
import Head from 'next/head';
import useExternalScriptsForIndex from '../utils/useExternalScriptsForIndex';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import toastNotification from '../components/toastNotify';
import { useAdapters } from '../utils/AdaptersContext';
import { useEffect, useState } from 'react';
import TronWeb from 'tronweb';
import axios from 'axios';
import { CopyrightStyles, MiniChart, TickerTape } from "react-ts-tradingview-widgets";
import { SingleTicker } from "react-ts-tradingview-widgets";


const LandingPage: NextPage = () => {
    useExternalScriptsForIndex();
    const tickerTheme = "light";
   
    const styles: CopyrightStyles = {
        parent: {
          color: "black",
        },
        link: {
          textDecoration: "line-trough",
        },
        span: {
          color: "black",
        },
      };


   

  return (
    <>
      <Head key={"landing-page"}> 
          <meta charSet="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
          <title>Asset Proof</title>
          <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/favicon.png"/>
          <link rel="stylesheet" href="/assets/vendor/nice-select/css/nice-select.css"/>
          <link rel="stylesheet" href="/assets/vendor/owl-carousel/css/owl.theme.default.css"/>
          <link rel="stylesheet" href="/assets/vendor/owl-carousel/css/owl.carousel.min.css"/>
          <link rel="stylesheet" href="/assets/css/style.css"/>
          <script defer
            src="https://code.jquery.com/jquery-3.3.1.js"
            integrity="sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60="
            crossOrigin="anonymous"></script>
      </Head>

      <body>

      <div id="main-wrapper" className='show'>

        <div className="header">
            <div className="container">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="navigation">
                            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                                <a className="navbar-brand"><img src="/assets/images/logo.png" alt=""/></a>
                                <button className="navbar-toggler" type="button" data-toggle="collapse"
                                    data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown"
                                    aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                                    <ul className="navbar-nav">
                                                                                
                                        <li className="nav-item">
                                            <a className="nav-link" href="#" data-scroll-nav="0">Home</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#" data-scroll-nav="1">Reports</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#" data-scroll-nav="2">Commitment </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#" data-scroll-nav="6">About</a>
                                        </li>
                                    </ul>
                                </div>
                                
                                <div className="signin-btn">
                                    {/* <a className="btn btn-primary text-white" onClick={() => adapters[selectedIndex].address?connectWallet(selectedIndex):setLoginShow(true)}>
                                                { loading?'...loading': 
                                                adapters[selectedIndex].address ?  "..."+adapters[selectedIndex].address.slice(-4)
                                                : "Connect Wallet"}</a> */}
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="intro" data-scroll-index="0">
            <div className="container">
                <div className="row justify-content-between align-items-center">
                    <div className="col-xl-6 col-lg-6 col-12">
                        <div className="intro-content">
                            <h1>Proof of <strong className="text-primary"> Reserves </strong>
                            </h1>
                            <p>We maintain a 1:1 reserve of all users&apos; funds on our platform.
                            </p>
                            <p>You need at least 100 TRX balance in order to verify USDT. Connect Wallet then Verify balance </p>
                        </div>

                        <div className="intro-btn">
                            {/* <a className="btn btn-primary text-white" onClick={() => adapters[selectedIndex].address?connectWallet(selectedIndex):setLoginShow(true)}>
                                    { loading?'...loading': 
                                    adapters[selectedIndex].address ?  "..."+adapters[selectedIndex].address.slice(-4)
                                    : "Connect Wallet"}</a>
                                   {adapters[selectedIndex].address? <a onClick={() => verifyWallet()} className="btn btn-outline-primary">Verify Wallet</a> : null} */}
  
                        </div>
                    </div>
                    <div className="col-xl-5 col-lg-6 col-12">
                    <div className="portfolio_img">
                            <img src="/assets/images/background/1.png" alt="" className="img-fluid"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* <TickerTape colorTheme={tickerTheme} 
            symbols= {[
                {
                "title": "USDTEUR",
                "proName": "BITSTAMP:USDTEUR"
                },
                {
                "title": "USDTUSD",
                "proName": "BITSTAMP:USDTUSD"
                },
                {
                "title": "USDTTRY",
                "proName": "BINANCE:USDTTRY"
                },
                {
                "title": "USDTGBP",
                "proName": "COINBASE:USDTGBP"
                },
                {
                "title": "USDTCAD",
                "proName": "KRAKEN:USDTCAD"
                },
                {
                "title": "USDTKRW",
                "proName": "BITHUMB:USDTKRW"
                }
            ]}
            showSymbolLogo={true}
            isTransparent={false}
            displayMode={'adaptive'}
            copyrightStyles={styles}
            locale="en"></TickerTape> */}

        <div className="price-grid section-padding" data-scroll-index="1">
        <div className="section-title">
                            <h2>USDT Markets</h2>
                        </div>

            <div className="container">
                <div className="row">
                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                        <div className="card">
                        <MiniChart colorTheme={tickerTheme} symbol="BINANCE:BTCUSDT" width="100%"></MiniChart>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                        <div className="card">
                            <MiniChart colorTheme={tickerTheme} symbol="BINANCE:XRPUSDT" width="100%"></MiniChart>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                        <div className="card">
                            <MiniChart colorTheme={tickerTheme} symbol="BINANCE:ETHUSDT" width="100%"></MiniChart>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                        <div className="card">
                            <MiniChart colorTheme={tickerTheme} symbol="BINANCE:BNBUSDT" width="100%"></MiniChart>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                        <div className="card">
                            <MiniChart colorTheme={tickerTheme} symbol="BINANCE:SOLUSDT" width="100%"></MiniChart>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                        <div className="card">
                            <MiniChart colorTheme={tickerTheme} symbol="BINANCE:LTCUSDT" width="100%"></MiniChart>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                        <div className="card">
                            <MiniChart colorTheme={tickerTheme} symbol="BINANCE:MATICUSDT" width="100%"></MiniChart>
                        </div>
                    </div>

                    {/* <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                        <div className="card">
                            <MiniChart colorTheme={tickerTheme} symbol="BINANCE:AVAXUSDT" width="100%"></MiniChart>
                        </div>
                    </div> */}

                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                        <div className="card">
                            <MiniChart colorTheme={tickerTheme} symbol="BINANCE:SHIBUSDT" width="100%"></MiniChart>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="get-touch section-padding"  data-scroll-index="6">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-6">
                        <div className="section-title">
                            <h2>Our Commitment to Transparency</h2>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-4 col-lg-4 col-md-4">
                        <div className="get-touch-content">
                            <div className="media">
                                <span><i className="fa fa-shield"></i></span>
                                <div className="media-body">
                                    <h4>Transparency</h4>
                                    <p>We will always be transparent with our users
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4">
                        <div className="get-touch-content">
                            <div className="media">
                                <span><i className="fa fa-cubes"></i></span>
                                <div className="media-body">
                                    <h4>Safety</h4>
                                    <p>The safety of our users funds is a priority for us
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4">
                        <div className="get-touch-content">
                            <div className="media">
                                <span><i className="fa fa-certificate"></i></span>
                                <div className="media-body">
                                    <h4>Protected</h4>
                                    <p>We only do one contract call for proof of funds
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                
                </div>
            </div>
        </div>



        <div className="portfolio section-padding-bottom" data-scroll-index="2">
            <div className="container">
                {/* <div className="row py-lg-5 justify-content-center">
                    <div className="col-xl-7">
                        <div className="section-title text-center">
                            <h2>Your 24/7 AI Trading Genius</h2>
                            <p>Leveraging sophisticated datasets, our AI delves deeper into market trends, offering you rich, actionable insights.</p>
                        </div>
                    </div>
                </div> */}
                <div className="row align-items-center justify-content-between">
                    <div className="col-xl-7 col-lg-6">
                        <div className="portfolio_list">
                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="media">
                                    
                                        <div className="media-body">
                                            <h4>
                                                What have we built?</h4>
                                            <p>In order to show that we have  all user assets 1:1, we have built and implemented the Merkle tree (shown below) to allow people to verify their assets within the platform. 
                                            Our goal is that every user will be able to verify their asset holdings using their own generated Merkle hash/record ID. 
                                            This way people will be able to confirm that their funds are held 1:1 and they can have it verified by a third-party audit agency.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            
                            
                                
                            </div>
                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="media">
                                    
                                        <div className="media-body">
                                            <h4>
                                            What is a Merkle Tree?</h4>
                                            <p>A Merkle Tree is a cryptographic tool that enables the consolidation of large amounts of data into a single hash.
                                            This single hash, called a Merkle Root, acts as a cryptographic seal that “summarizes” all the inputted data. Additionally,
                                                Merkle Trees give users the ability to verify specific contents that were included within a particular set of “sealed” data. 
                                            We use these properties of Merkle Trees during our Proof of funds assessments to verify individual user accounts are included within
                                            the liabilities report inspected by the auditor.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                            
                                
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-5 col-lg-6">
                        <div className="portfolio_img" >
                            <img src="/assets/images/background/hash-dark.png" alt="" className="img-fluid"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="get-touch section-padding"  data-scroll-index="6">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-6">
                        <div className="section-title">
                            <h2>How it works.</h2>
                        </div>
                    </div>
                    <div className="col-xl-12 col-lg-12">
                        <div className="portfolio_img">
                            <img src="/assets/images/background/10.png" alt="" className="img-fluid"/>
                        </div>
                        
                    </div>
                </div>
        
                <div className="row" style={{ marginTop: "50px" }}>
            
                    <div className="col-xl-6 col-lg-6 col-md-6">
                        <div className="get-touch-content">
                            <div className="media">
                            
                                <div className="media-body">
                                    <h4>01. Wallet Connect & Authorization</h4>
                                    <p>For assets that are used to verify reserves, 
                                    we must ensure that ownership of the wallet belongs to
                                    the user. Then, the user will be prompted to authorize
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6">
                        <div className="get-touch-content">
                            <div className="media">
                            
                                <div className="media-body">
                                    <h4>02. Snapshot of User Balances</h4>
                                    <p>The snapshot value is calculated based on the asset holding within 
                                    the customer&apos;s account balances at the date and time of the snapshot.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6">
                        <div className="get-touch-content">
                            <div className="media">
                                
                                <div className="media-body">
                                    <h4>03 Generate zk-SNARKs Proof</h4>
                                    <p> We generate zk-SNARKs proof files for users so that each user 
                                    can easily access their leaf node, providing transparency for all users
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6">
                        <div className="get-touch-content">
                            <div className="media">
                                
                                <div className="media-body">
                                    <h4>04 Generation of Merkle Tree</h4>
                                    <p>We generate the underlying data block by linking the hashed UID and balance of each user.
                                    We then generate a Merkle tree based upon all users&apos; data.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        
         <TickerTape colorTheme={tickerTheme} 
            symbols= {[
                {
                "title": "USDTEUR",
                "proName": "BITSTAMP:USDTEUR"
                },
                {
                "title": "USDTUSD",
                "proName": "BITSTAMP:USDTUSD"
                },
                {
                "title": "USDTTRY",
                "proName": "BINANCE:USDTTRY"
                },
                {
                "title": "USDTGBP",
                "proName": "COINBASE:USDTGBP"
                },
                {
                "title": "USDTCAD",
                "proName": "KRAKEN:USDTCAD"
                },
                {
                "title": "USDTKRW",
                "proName": "BITHUMB:USDTKRW"
                }
            ]}
            showSymbolLogo={true}
            isTransparent={false}
            displayMode={'adaptive'}
            copyrightStyles={styles}
            locale="en"></TickerTape>


        <div className="bottom section-padding">
        <div className="container">
        <div className="row">
        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3">
        <div className="bottom-logo">
        <img className="pb-3" src="/assets/images/logo.png" alt=""/>
        <p>Proof of Reserves (PoR) verifies digital asset collateralization held by crypto businesses, 
        helping bring greater transparency to depositors via public attestations and independent audits.</p>
        </div>
        </div>
        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3">
        <div className="bottom-widget">
        <h4 className="widget-title">Company</h4>
        <ul>
        <li><a href="#" data-scroll-nav="0">Home</a></li>
        <li><a href="#" data-scroll-nav="1">Latest Reports</a></li>
        <li><a href="#" data-scroll-nav="1">Privacy</a></li>
        </ul>
        </div>
        </div>
        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3">






        <div className="bottom-widget">
        <h4 className="widget-title">Products</h4>
        <ul>
        <li><a href="https://www.binance.com/en/eth2" data-scroll-nav="2"> ETH Staking</a></li>
        <li><a href="https://www.binance.com/en/nft/home" data-scroll-nav="6">NFT</a></li>
        <li><a href="https://www.binance.com/en/bnb" data-scroll-nav="6">BNB</a></li>
        <li><a href="https://www.binance.com/en/BABT?source=footer" data-scroll-nav="6">BABT</a></li>
        <li><a href="https://www.binance.com/en/research" data-scroll-nav="6">Research</a></li>
        <li><a href="https://www.binance.charity/" data-scroll-nav="6">Charity</a></li>
        </ul>
        </div>

        </div>
        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3">







        <div className="bottom-widget">
        <h4 className="widget-title">Business</h4>
        <ul>
        <li><a href="https://www.binance.com/en/how-to-buy/bitcoin" data-scroll-nav="2">Buy BNB</a></li>
        <li><a href="https://www.binance.com/en/how-to-buy/bitcoin" data-scroll-nav="6">Buy Ripple</a></li>
        <li><a href="https://www.binance.com/en/how-to-buy/bitcoin" data-scroll-nav="6">Buy Dogecoin</a></li>
        <li><a href="https://www.binance.com/en/how-to-buy/bitcoin" data-scroll-nav="6">Buy Bitcoin</a></li>
        <li><a href="https://www.binance.com/en/price/ethereum" data-scroll-nav="6">Ethereum Price</a></li>
        <li><a href="https://www.binance.com/en/price-prediction" data-scroll-nav="6">Browse Crypto Price Predictions</a></li>
        </ul>
        </div>

        </div>
        </div>
        </div>
        </div>

        <div className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="copyright">
                            <p>© Copyright 2024 <a href="#"></a> | All Rights Reserved</p>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="footer-social">
                            <ul>
                                <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                                <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                                <li><a href="#"><i className="fa fa-linkedin"></i></a></li>
                                <li><a href="#"><i className="fa fa-youtube"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>

      </body>
    </>

  );
//   
};

export default LandingPage;
