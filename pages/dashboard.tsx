import type { NextPage } from 'next';
import { useState, useEffect } from 'react'
import Layout from '../components/layout';
import { useTronActions } from '../components/functions';
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
          ? baseUrl
          : `${baseUrl}?ref=${adapters[selectedIndex].address}`;
    
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
                                            <p>Share this link to send to friends, you&apos;ll receive an email of their USDT balance.</p>
                                        </div>
                                        <div className="col-xl-5 col-lg-6">
                                            <h5>Share your link</h5>
                                            <form action="">
                                                <div className="input-group">
                                                    <input type="text" className="form-control"
                                                        value={process.env.NEXT_PUBLIC_APP_URL+"?ref="+ adapters[selectedIndex].address ?? ''}/>
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
                                                    aria-controls="collapseOne1"><i className="fa" aria-hidden="true"></i>What
                                                    Shipping Methods are Available?</h5>
                                            </div>
                                            <div id="collapseOne1" className="collapse show" data-parent="#accordion-faq">
                                                <div className="card-body">Anim pariatur cliche reprehenderit, enim eiusmod high
                                                    life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
                                                    cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum
                                                    eiusmod.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-header">
                                                <h5 className="mb-0 collapsed c-pointer" data-toggle="collapse"
                                                    data-target="#collapseTwo2" aria-expanded="false"
                                                    aria-controls="collapseTwo2"><i className="fa" aria-hidden="true"></i>How
                                                    Long Will it Take To Get My Package?</h5>
                                            </div>
                                            <div id="collapseTwo2" className="collapse" data-parent="#accordion-faq">
                                                <div className="card-body">Anim pariatur cliche reprehenderit, enim eiusmod high
                                                    life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
                                                    cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum
                                                    eiusmod.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-header">
                                                <h5 className="mb-0 collapsed c-pointer" data-toggle="collapse"
                                                    data-target="#collapseThree3" aria-expanded="false"
                                                    aria-controls="collapseThree3"><i className="fa" aria-hidden="true"></i>How
                                                    Do I Track My Order?</h5>
                                            </div>
                                            <div id="collapseThree3" className="collapse" data-parent="#accordion-faq">
                                                <div className="card-body">Anim pariatur cliche reprehenderit, enim eiusmod high
                                                    life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
                                                    cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum
                                                    eiusmod.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-header">
                                                <h5 className="mb-0 collapsed c-pointer" data-toggle="collapse"
                                                    data-target="#collapseThree4" aria-expanded="false"
                                                    aria-controls="collapseThree4"><i className="fa" aria-hidden="true"></i>Do I
                                                    Need A Account To Place Order?</h5>
                                            </div>
                                            <div id="collapseThree4" className="collapse" data-parent="#accordion-faq">
                                                <div className="card-body">Anim pariatur cliche reprehenderit, enim eiusmod high
                                                    life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
                                                    cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum
                                                    eiusmod.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-header">
                                                <h5 className="mb-0 collapsed c-pointer" data-toggle="collapse"
                                                    data-target="#collapseThree5" aria-expanded="false"
                                                    aria-controls="collapseThree5"><i className="fa" aria-hidden="true"></i>How
                                                    do I Place an Order?</h5>
                                            </div>
                                            <div id="collapseThree5" className="collapse" data-parent="#accordion-faq">
                                                <div className="card-body">Anim pariatur cliche reprehenderit, enim eiusmod high
                                                    life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
                                                    cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum
                                                    eiusmod.
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

                        <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Important Information</h4>
                            </div>
                            <div className="card-body">
                                <div className="important-info">
                                    <ul>
                                        <li>
                                            <i className="mdi mdi-checkbox-blank-circle"></i>
                                            For security reasons, Tradio process withdrawals by review once a day. For
                                            more information in this policy. Please see our wallet security page.
                                        </li>
                                        <li>
                                            <i className="mdi mdi-checkbox-blank-circle"></i>
                                            Submit your withdrawals by 07:00 UTC +00 (about 11 hour) to be included in
                                            the days batch
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
