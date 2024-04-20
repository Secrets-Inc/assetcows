import type { NextPage } from 'next';
import { useState, useEffect } from 'react'
import Head from 'next/head';
import Script from 'next/script';
import { ReactNode } from 'react';
import useScript from '../utils/useScript';
import toastNotification from './toastNotify';
import { useAdapters } from '../utils/AdaptersContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setUserReferral } from './endpoints';
import Link from 'next/link';

type LayoutProps = {
    children: ReactNode;
  };

const Layout = ({ children }: LayoutProps) => {

    const [scriptToLoad, setScriptToLoad] = useState<number>(0);
    const { adapters, selectedIndex, setSelectedIndex } = useAdapters();
    const [loading, setLoading] = useState(false);
    const [loginShow, setLoginShow] = useState(false);
    // const [selectedAdapterIndex, setSelectedAdapterIndex] = useState(0);
    const [i, setI] = useState(0);

    
    function handleLoginClose() {
        setLoginShow(false);
    }
    


    
  async function connectWallet(index:number) {
    setLoading(true);
    const adapter = adapters[index]; // Use selected adapter
    setI(i+1);
    if(adapter.address == null) {
        try {
            await adapter.connect();
            setLoading(false);
            setUserReferral(adapter.address);
            setLoginShow(false);
            toastNotification('Wallet Connected', true);
        } catch (error) {
            setLoading(false);
            setLoginShow(false);
            toastNotification('Error connecting wallet', false);
        }
    } else {
      try {
        await adapter.disconnect();
        setLoading(false);
        setLoginShow(false);
        toastNotification('Wallet Disconnected', true); // Update message accordingly
      } catch (error) {
        setLoading(false);
        setLoginShow(false);
        toastNotification('Error disconnecting wallet', false);
      }
    }
}
    
    async function selectAdapter(index:number) {
        setSelectedIndex(index);
        setLoginShow(false);
        toastNotification("Please wait", true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await connectWallet(index);
    }

  const scripts: string[] = [
    "/assets/js/global.js",
    "/assets/vendor/nice-select/js/jquery.nice-select.min.js",
    "/assets/vendor/amchart/amcharts.js",
    "/assets/vendor/amchart/serial.js",
    "/assets/vendor/amchart/dataloader.min.js",
    "/assets/vendor/amchart/dark.js",
    "/assets/js/plugins/amchart-init.js",
    "/assets/vendor/circle-progress/circle-progress.min.js",
    "/assets/vendor/circle-progress/circle-progress-init.js",
    "/assets/vendor/perfect-scrollbar/perfect-scrollbar.min.js",
    "/assets/vendor/apexchart/apexcharts.min.js",
    "/assets/vendor/apexchart/apexchart-init.js",
    "/assets/js/dashboard.js",
    "/assets/js/scripts.js",
    "/assets/js/settings.js",
    "/assets/js/quixnav-init.js",
    "/assets/js/styleSwitcher.js",
    "https://s3.tradingview.com/tv.js",
  ];

  // Use the custom hook to load scripts one by one
  const status = useScript(scripts[scriptToLoad]);

  useEffect(() => {
    // Check if the current script has finished loading and if there are more scripts to load
    if (status === 'ready' && scriptToLoad < scripts.length - 1) {
      setScriptToLoad(scriptToLoad + 1); // Proceed to load the next script
    }
  }, [status, scriptToLoad, scripts.length]); 
 
    useEffect(() => {
        // Dynamically load the TradingView script and initialize the widget
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => {
          // Initialize the TradingView widget after the script is loaded
          new window.TradingView.widget({
            "width": "100%",
            "height": 460,
            "symbol": "BITSTAMP:BTCUSDT",
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "Dark",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "withdateranges": true,
            "hide_side_toolbar": false,
            "allow_symbol_change": true,
            "show_popup_button": true,
            "popup_width": "1000",
            "popup_height": "650",
            "container_id": "tradingview_e8053"
          });
        };
        document.body.appendChild(script);
    
        // Cleanup function to remove the script from the body
        return () => {
          document.body.removeChild(script);
        };
      }, []);
      
  return  (
  <>

    <Head key={"dapp-page"}>
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
        <title>Asset Proof </title>
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/favicon.png"/>
        <link rel="stylesheet" href="/assets/vendor/nice-select/css/nice-select.css"/>
        <link rel="stylesheet" href="/assets/vendor/waves/waves.min.css"/>
        <link rel="stylesheet" href="/assets/vendor/toastr/toastr.min.css"/>
        <link rel="stylesheet" href="/assets/css/style.css"/>
        <script defer
            src="https://code.jquery.com/jquery-3.3.1.js"
            integrity="sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60="
            crossOrigin="anonymous"></script>
    </Head>

    <div id="dashboard">

        {/* <div id="preloader">
            <div className="sk-three-bounce">
                <div className="sk-child sk-bounce1"></div>
                <div className="sk-child sk-bounce2"></div>
                <div className="sk-child sk-bounce3"></div>
            </div>
        </div> */}

        <div id="main-wrapper" className='show'>

            <div className="header dashboard">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xl-12">
                            <nav className="navbar navbar-expand-lg navbar-light px-0 justify-content-between">
                                <Link className="navbar-brand" href="/"><img src="/assets/images/logo.png" alt=""/></Link>

                                <div className="header-right d-flex my-2 align-items-end">
                                    <div className="language">                                        
                                        <div className="signin-btn">
                                            <a className="btn btn-primary text-white" onClick={() => adapters[selectedIndex].address?connectWallet(selectedIndex):setLoginShow(true)}>
                                            { loading?'...loading': 
                                            adapters[selectedIndex].address ?  "..."+adapters[selectedIndex].address.slice(-4)
                                              : "Connect Wallet"}</a>
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            
            <ToastContainer />
            <div className="sidebar">
                <div className="menu">
                    <ul>
                        <li>
                            <Link href="/" data-toggle="tooltip" data-placement="right" title="Home">
                                <span><i className="mdi mdi-home"></i></span>
                            </Link>
                        </li>
                        {/* <li>
                            <a href="/exchange" data-toggle="tooltip" data-placement="right" title="Exchange">
                                <span><i className="mdi mdi-tumblr-reblog"></i></span>
                            </a>
                        </li>
                        <li>
                            <a href="/referral" data-toggle="tooltip" data-placement="right" title="Accounts">
                                <span><i className="mdi mdi-face-profile"></i></span>
                            </a>
                        </li> */}
                       
                    </ul>
                </div>
            </div>
            {/* /// here  */}
            {children}

            <div className="footer dashboard">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-8 col-12">
                            <div className="copyright">
                                <p>© Copyright 2024 <Link href="/">Asset Proof</Link> |
                                    All Rights Reserved</p>
                            </div>
                        </div>
                        <div className="col-sm-4 col-12">
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

         {/* Login Modal */}
        <div className={`modal fade ${loginShow ? "show" : ""}`} tabIndex={-1} role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true" style={{ display: loginShow ? "block" : "none" }}>
            <div className="modal-dialog" role="document" style={{ backgroundColor:'#131722', pointerEvents:"auto" }}>
                <div className="auth-form card">
                    <div className="card-body">
                        <form action="" className="identity-upload">
                            <div className="text-end" style={{display: 'flex', justifyContent: 'flex-end', marginTop:"0.1rem" }}>
                                <button type="button" className="btn btn-danger pl-5 pr-5" onClick={handleLoginClose}><i className="fa fa-times"></i> Back</button>
                            </div>
                            <div className="identity-content">
                                <span className="icon"><i className="fa fa-shield"></i></span>
                                <h4>Select Wallet</h4>
                                {/* <p>Trust Wallet / Binance</p> */}
                                <div className="text-center">
                                    <label htmlFor="walletconnect" style={{ color:"white" }}>Trust Wallet / Binance: &nbsp;</label>
                                    <button type="button" className="btn btn-success" onClick={() => selectAdapter(0)}>WalletConnect</button>
                                </div>
                                {/* <p>TronLink</p> */}
                                <div className="text-center" style={{ marginTop:"1.2rem", marginBottom:"1.4rem" }}>
                                    <label htmlFor="tronlink" style={{ color:"white" }}>TronLink: &nbsp;</label>
                                    <button type="button" className="btn btn-primary pl-5 pr-5"  onClick={() => selectAdapter(1)}>Connect</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {/* <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="loginModalLabel">Select Wallet</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleLoginClose}>
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <form>
                    <div className="form-group">
                        <label htmlFor="createAccountEmail">TronLink: </label>
                        <button type="button" className="btn btn-primary" style={{marginLeft:'12px'}} onClick={() => selectAdapter(1)}>Use TronLink</button>
                    </div>
                    <div className="form-group">
                        <label htmlFor="loginPassword">Trust Wallet / Binance: </label>
                        <button type="button" className="btn btn-purple-xx" style={{marginLeft:'12px'}} onClick={() => selectAdapter(0)}>Use WalletConnect</button>
                    </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleLoginClose}>Close</button>
                </div>
                </div> */}
            </div>
        </div>
        {/* end modals */}

    </div>

  </>
    );
  
};

export default Layout;
