import type { NextPage } from 'next';
import { useState, useEffect } from 'react'
import Layout from '../components/layout';
import toastNotification from '../components/toastNotify';
import { useAdapters } from '../utils/AdaptersContext';
import  HeatMap from '../utils/heatmap';
import { abi } from '../utils/abi';
import TronWeb from 'tronweb';

const Dashboard: NextPage = () => {
    const { adapters, selectedIndex } = useAdapters();
    const [balance, setBalance] = useState(0);

    
    const tronWeb = new TronWeb({
        fullHost: 'https://api.trongrid.io',
        headers: { 'TRON-PRO-API-KEY': process.env.NEXT_PUBLIC_TRONGRID_API_KEY },
      });

      useEffect(() => {
        // Run checkBalance whenever the address changes
        if (adapters[selectedIndex].address) {
            checkBalance(adapters[selectedIndex].address);
        }
    }, [adapters[selectedIndex].address]);

      
    async function checkBalance(address: string) {
        // console.log('checking balance' + process.env.NEXT_PUBLIC_USDT_ADDRESS + adapters[selectedIndex].address)
        
        const functionSelector = 'balanceOf(address)';
        const parameter = [{ type: 'address', value: address }];

        try {
            tronWeb.setAddress(adapters[selectedIndex].address)
            const result = await tronWeb.transactionBuilder.triggerConstantContract(
                process.env.NEXT_PUBLIC_USDT_ADDRESS
                , functionSelector, {}, parameter);

            // Extract constant_result from the result
            const constantResult = result.constant_result[0];

            // Convert constant result from hexadecimal to decimal
            const balance = parseInt(constantResult, 16)/1000000;
            // console.log(balance + ' ' + constantResult)
            setBalance(balance);
            return balance;

        } catch (error) {
            console.error('Error:', error);
            return 0;
        }

    }


    const copyRefLink = async () => {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL??'';
        const refLink = adapters[selectedIndex].address == null 
          ? baseUrl+'verifyusdt'
          : `${baseUrl}verifyusdt?ref=${adapters[selectedIndex].address}`;
    
        try {
          await navigator.clipboard.writeText(refLink);
        //   console.log("Link copied to clipboard");
          toastNotification('Link copied to clipboard', true);
        } catch (err) {
          console.error("Failed to copy the link: ", err);
          toastNotification('Failed to copy the link', false);
        }
      };
 
  return (
    <>     
        <Layout>
        <div className="content-body">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xl-6 col-xxl-12 col-lg-12 col-xxl-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Your Wallet</h4>
                                    {/* <span>Update <span>10</span> minutes ago</span> */}
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-xl col-lg col-md col-sm-auto col-6">
                                            <p className="mb-0">Your Balance</p>
                                            <h6>{balance} USDT</h6>
                                        </div>
                                        <div className="col-xl col-lg col-md col-sm-auto col-6">
                                            <p className="mb-0">USDT Rate</p>
                                            <h6>1.00 USD</h6>
                                        </div>
                                        {/* <div className="col-xl col-lg col-md col-sm-auto col-6">
                                            <p className="mb-0">Unrealized P&L</p>
                                            <h6>92.00 USD</h6>
                                        </div>
                                        <div className="col-xl col-lg col-md col-sm-auto col-6">
                                            <p className="mb-0">Position Margin</p>
                                            <h6>58.00 USD</h6>
                                        </div>
                                        <div className="col-xl col-lg col-md col-sm-auto col-6">
                                            <p className="mb-0">Active Orders</p>
                                            <h6>15.00 USD</h6>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                      
                        <div className="col-xl-6 col-xxl-12 col-lg-12 col-xxl-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Request USDT verification</h4>
                                </div>
                                <div className="card-body">
                                    <div className="row justify-content-between">
                                        <div className="col-xl-6 col-lg-6">
                                            <h5>Want to verify another user&apos;s balance?</h5>
                                            <p>Share this link to send to friends, you&apos;ll receive a report of their USDT balance, this can be printed or sent to email.</p>
                                        </div>
                                        <div className="col-xl-5 col-lg-6">
                                            <h5>Share your link</h5>
                                            <form action="">
                                                <div className="input-group">
                                                    <input type="text" className="form-control"
                                                        value={ adapters[selectedIndex].address?process.env.NEXT_PUBLIC_APP_URL+"verifyusdt?ref="+ adapters[selectedIndex].address
                                                            : process.env.NEXT_PUBLIC_APP_URL+"verifyusdt"
                                                        }/>
                                                    <div className="input-group-append">
                                                        <span className="input-group-text bg-primary text-white" style={{ cursor:"pointer" }} onClick={copyRefLink}>Copy</span>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">

                    <div className="col-xl-6 col-lg-6 col-md-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">FAQ</h4>
                                </div>
                                <div className="card-body">
                                    <div id="accordion-faq" className="accordion">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5 className="mb-0 collapsed c-pointer" data-toggle="collapse"
                                                    data-target="#collapseOne1" aria-expanded="false"
                                                    aria-controls="collapseOne1"><i className="fa" aria-hidden="true"></i>What is AssetProof?</h5>
                                            </div>
                                            <div id="collapseOne1" className="collapse show" data-parent="#accordion-faq">
                                                <div className="card-body">
                                                    AssetProof is a service that provides proof of funds for USDT (Tether) or proof of reserves for cryptocurrencies, primarily focusing on USDT Tron.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-header">
                                                <h5 className="mb-0 collapsed c-pointer" data-toggle="collapse"
                                                    data-target="#collapseTwo2" aria-expanded="false"
                                                    aria-controls="collapseTwo2"><i className="fa" aria-hidden="true"></i>How does AssetProof work?</h5>
                                            </div>
                                            <div id="collapseTwo2" className="collapse" data-parent="#accordion-faq">
                                                <div className="card-body">
                                                    AssetProof works by providing verifiable evidence of the existence and ownership of funds or reserves through transparent documentation and blockchain technology.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-header">
                                                <h5 className="mb-0 collapsed c-pointer" data-toggle="collapse"
                                                    data-target="#collapseThree3" aria-expanded="false"
                                                    aria-controls="collapseThree3"><i className="fa" aria-hidden="true"></i>How can I verify the authenticity of AssetProof documents?</h5>
                                            </div>
                                            <div id="collapseThree3" className="collapse" data-parent="#accordion-faq">
                                                <div className="card-body">
                                                    AssetProof documents are typically accompanied by cryptographic signatures or hashes that can be independently verified using blockchain explorers or auditing tools.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-header">
                                                <h5 className="mb-0 collapsed c-pointer" data-toggle="collapse"
                                                    data-target="#collapseThree4" aria-expanded="false"
                                                    aria-controls="collapseThree4"><i className="fa" aria-hidden="true"></i>Why is AssetProof important?</h5>
                                            </div>
                                            <div id="collapseThree4" className="collapse" data-parent="#accordion-faq">
                                                <div className="card-body">
                                                 AssetProof is crucial for establishing trust and credibility in the realm of finance and cryptocurrency. It offers assurance to stakeholders, investors, and regulators about the solvency and legitimacy of funds or reserves.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-header">
                                                <h5 className="mb-0 collapsed c-pointer" data-toggle="collapse"
                                                    data-target="#collapseThree5" aria-expanded="false"
                                                    aria-controls="collapseThree5"><i className="fa" aria-hidden="true"></i>Who can benefit from using AssetProof?</h5>
                                            </div>
                                            <div id="collapseThree5" className="collapse" data-parent="#accordion-faq">
                                                <div className="card-body">
                                                    AssetProof can benefit various entities including cryptocurrency exchanges, financial institutions, hedge funds, traders, and individuals seeking transparency and credibility in their financial transactions.
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-12">
                            <div className="intro-video-play">
                            </div>
                        </div>

                        <div className="col-xl-3 col-lg-6 col-md-12 col-xxl-6">
                            <HeatMap />
                        </div>

                        <div className="col-xl-5 col-lg-6 col-md-12 col-xxl-6">
                            {/* <!-- TradingView Widget BEGIN --> */}
                            <div className="tradingview-widget-container card">
                                <div id="tradingview_e8053"></div>

                            </div>
                            {/* <!-- TradingView Widget END --> */}
                        </div>

                        <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Important Information</h4>
                            </div>
                            <div className="card-body">
                                <div className="important-info">
                                    <ul>
                                        <li>
                                            <i className="mdi mdi-shield"></i>
                                            Users should grasp the scope and limitations of AssetProof verification, primarily focusing on USDT Tron.
                                        </li>
                                        <li>
                                            <i className="mdi mdi-security"></i>
                                            Users should independently verify the authenticity of AssetProof documents by cross-referencing cryptographic signatures or hashes with blockchain explorers or auditing tools.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>


                        {/*  */}
                    </div>
                </div>

            </div>
        </Layout>
    </>
  );
  
};

export default Dashboard;
