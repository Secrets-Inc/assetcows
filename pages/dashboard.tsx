import type { NextPage } from 'next';
import { useState, useEffect } from 'react'
import Layout from '../components/layout';
import { useTronActions } from '../components/functions';
import toastNotification from '../components/toastNotify';
import { useAdapters } from '../utils/AdaptersContext';
import { abi } from '../utils/abi';
import TronWeb from 'tronweb';

const Dashboard: NextPage = () => {
    const [amount, setAmount] = useState<number>(0);
    const { deposit, withdraw } = useTronActions();
    const [depositLoading, setDepositLoading] = useState(false);
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [userbalance, setUserBalance] = useState(0);
    const { adapters, selectedIndex } = useAdapters();
    let contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

    
    const tronWeb = new TronWeb({
        fullHost: 'https://api.trongrid.io',
        headers: { 'TRON-PRO-API-KEY': process.env.NEXT_PUBLIC_TRONGRID_API_KEY },
      });

    useEffect(() => {
        const fetchContractData = async () => {
            let contract = await tronWeb.contract(abi,contractAddress); 
            if (adapters[selectedIndex].address != null) {
                tronWeb.setAddress(adapters[selectedIndex].address);

                contract.getUserStats(adapters[selectedIndex].address).call().then((result:any) => {
                    setUserBalance(Number(result[0]));
                }).catch((err:any) => console.log(err))              
            }
        };

        fetchContractData();
    }, [adapters[selectedIndex].address]);

    
     // Handle deposit action
     const handleDeposit = async () => {
        deposit(amount, {
            onStart: () => setDepositLoading(true),
            onSuccess: () => {
                setAmount(0);
                setDepositLoading(false);
                toastNotification('Deposit Successful',true);
            },
            onError: (error) => {
                setDepositLoading(false);
                toastNotification("Error depositing USDT",false);
            }
        });
    };

    // Handle withdraw action
    const handleWithdraw = async () => {
        withdraw(amount, {
            onStart: () => setWithdrawLoading(true),
            onSuccess: () => {
                setAmount(0);
                setWithdrawLoading(false);
                toastNotification('Withdraw successful',true);
            },
            onError: (error) => {
                setWithdrawLoading(false);
                toastNotification('Withdraw error',false);
            }
        });
    };

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
                                            <h6>{userbalance} USDT</h6>
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
                                            <h5>Want to verify another user's balance?</h5>
                                            <p>Share this link to send to friends, you'll receive an email of their USDT balance.</p>
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
                            <div className="card">
                                <div className="card-header">
                                    <ul className="nav nav-pills" role="tablist">
                                        <li className="nav-item">
                                            <a className="nav-link active" data-toggle="pill" href="#limit" role="tab"
                                                aria-selected="true">Market</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="card-body market-limit">
                                    <div className="tab-content">
                                        <div className="tab-pane fade show active" id="market" role="tabpanel">

                                            <form name="myform" className="currency_limit">

                                                <div className="form-group">
                                                    <div className="input-group">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text">USD</span>
                                                        </div>
                                                        <input type="text" name="currency_amount"
                                                            className="form-control text-right"  value={amount}
                                                            onChange={(e) => setAmount(Number(e.target.value))}/>
                                                    </div>
                                                </div>

                                                <ul className="list-group market-nested">
                                                    <li
                                                        className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                        Value in USDT
                                                        <span className="strong"> {amount*0.998} USDT</span>
                                                    </li>
                                                    <li
                                                        className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                        Order Value
                                                        <span className="strong">65850 USDT</span>
                                                    </li>
                                                    <li
                                                        className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                        Available Margin
                                                        <span className="strong">15458 USDT</span>
                                                    </li>
                                                    <li
                                                        className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                        Buy Cost @ 1.0x
                                                        <span className="strong">0.00 USDT</span>
                                                    </li>
                                                    <li
                                                        className="list-group-item border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                                        Sell Cost @ 1.0x
                                                        <span className="strong">0.00 USDT</span>
                                                    </li>
                                                </ul>

                                                <div className="btn-group btn-block mt-3">
                                                    <button type="button" name="deposit" className="btn btn-success" onClick={handleDeposit}>{depositLoading ? '...check your wallet' :'Deposit'}</button>
                                                    <button type="button" name="withdraw" className="btn btn-danger" onClick={handleWithdraw}>{withdrawLoading ?'...check your wallet':'Withdraw'}</button>
                                                </div>

                                            </form>

                                        </div>
                                        {/*  */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-5 col-lg-6 col-md-12 col-xxl-6">
                            {/* <!-- TradingView Widget BEGIN --> */}
                            <div className="tradingview-widget-container card">
                                <div id="tradingview_e8053"></div>

                            </div>
                            {/* <!-- TradingView Widget END --> */}
                        </div>

                        <div className="col-xl-2 col-lg-4 col-md-6 col-xxl-4">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Order Book</h4>
                                </div>
                                <div className="card-body order-book">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Price (USD)</th>
                                                <th scope="col">Price (BTC)</th>
                                                <th scope="col">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="text-danger">10393.50</td>
                                                <td>0.010</td>
                                                <td>14.109</td>
                                            </tr>
                                            <tr>
                                                <td className="text-danger">10393.50</td>
                                                <td>0.010</td>
                                                <td>14.109</td>
                                            </tr>
                                            <tr>
                                                <td className="text-danger">10393.50</td>
                                                <td>0.010</td>
                                                <td>14.109</td>
                                            </tr>
                                            <tr>
                                                <td className="text-danger">10393.50</td>
                                                <td>0.010</td>
                                                <td>14.109</td>
                                            </tr>
                                            <tr>
                                                <td className="text-danger">10393.50</td>
                                                <td>0.010</td>
                                                <td>14.109</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div className="order-book-divider">
                                        <h6 className="text-danger"> <i className="la la-arrow-down"></i> 6587.35</h6>
                                        <span>6520.220 / 4835.00</span>
                                    </div>

                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Price (USD)</th>
                                                <th scope="col">Price (BTC)</th>
                                                <th scope="col">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="text-success">10393.50</td>
                                                <td>0.010</td>
                                                <td>14.109</td>
                                            </tr>
                                            <tr>
                                                <td className="text-success">10393.50</td>
                                                <td>0.010</td>
                                                <td>14.109</td>
                                            </tr>
                                            <tr>
                                                <td className="text-success">10393.50</td>
                                                <td>0.010</td>
                                                <td>14.109</td>
                                            </tr>
                                            <tr>
                                                <td className="text-success">10393.50</td>
                                                <td>0.010</td>
                                                <td>14.109</td>
                                            </tr>
                                            <tr>
                                                <td className="text-success">10393.50</td>
                                                <td>0.010</td>
                                                <td>14.109</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-2 col-lg-4 col-md-6 col-xxl-4">
                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h4 className="card-title">Trade History</h4>
                                        </div>
                                        <div className="card-body trade-history">
                                            <div className="table-responsive">
                                                <table className="table table-borderless">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Price</th>
                                                            <th scope="col">Size</th>
                                                            <th scope="col">Time</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="text-danger">10393.50</td>
                                                            <td>0.010</td>
                                                            <td>14.109</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-danger">10393.50</td>
                                                            <td>0.010</td>
                                                            <td>14.109</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-danger">10393.50</td>
                                                            <td>0.010</td>
                                                            <td>14.109</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-danger">10393.50</td>
                                                            <td>0.010</td>
                                                            <td>14.109</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-danger">10393.50</td>
                                                            <td>0.010</td>
                                                            <td>14.109</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-danger">10393.50</td>
                                                            <td>0.010</td>
                                                            <td>14.109</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-danger">10393.50</td>
                                                            <td>0.010</td>
                                                            <td>14.109</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-danger">10393.50</td>
                                                            <td>0.010</td>
                                                            <td>14.109</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-danger">10393.50</td>
                                                            <td>0.010</td>
                                                            <td>14.109</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-danger">10393.50</td>
                                                            <td>0.010</td>
                                                            <td>14.109</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-danger">10393.50</td>
                                                            <td>0.010</td>
                                                            <td>14.109</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-danger">10393.50</td>
                                                            <td>0.010</td>
                                                            <td>14.109</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-danger">10393.50</td>
                                                            <td>0.010</td>
                                                            <td>14.109</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-danger">10393.50</td>
                                                            <td>0.010</td>
                                                            <td>14.109</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-danger">10393.50</td>
                                                            <td>0.010</td>
                                                            <td>14.109</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 col-lg-4 col-md-12 col-xxl-4">
                            <div className="card">
                                <div className="card-header">
                                    <ul className="nav nav-pills" role="tablist">
                                        <li className="nav-item">
                                            <a className="nav-link" data-toggle="pill" href="#STAR" role="tab"
                                                aria-selected="true"><i className="mdi mdi-star"></i></a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link active" data-toggle="pill" href="#BTC" role="tab"
                                                aria-selected="true">BTC</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-toggle="pill" href="#ETH" role="tab"
                                                aria-selected="false">ETH</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-toggle="pill" href="#NEO" role="tab"
                                                aria-selected="false">NEO</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-toggle="pill" href="#USDT" role="tab"
                                                aria-selected="false">USDT</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-toggle="pill" href="#DAI" role="tab"
                                                aria-selected="false">DAI</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="card-body  price-pair">

                                    <div className="tab-content">
                                        <div className="tab-pane fade show" id="STAR" role="tabpanel">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Pairs</th>
                                                        <th>Last Price</th>
                                                        <th>Change</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> ETH/BTC</td>
                                                        <td>0.00020255</td>
                                                        <td className="red">-2.58%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> KCS/BTC</td>
                                                        <td>0.00013192</td>
                                                        <td className="green">+5.6%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> XRP/BTC</td>
                                                        <td>0.00002996</td>
                                                        <td className="red">-1.55%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> VET/BTC</td>
                                                        <td>0.00000103</td>
                                                        <td className="green">+1.8%</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="tab-pane fade show active" id="BTC" role="tabpanel">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Pairs</th>
                                                        <th>Last Price</th>
                                                        <th>Change</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> ETH/BTC</td>
                                                        <td>0.00020255</td>
                                                        <td className="red">-2.58%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> KCS/BTC</td>
                                                        <td>0.00013192</td>
                                                        <td className="green">+5.6%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> XRP/BTC</td>
                                                        <td>0.00002996</td>
                                                        <td className="red">-1.55%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> VET/BTC</td>
                                                        <td>0.00000103</td>
                                                        <td className="green">+1.8%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> EOS/BTC</td>
                                                        <td>0.00000103</td>
                                                        <td className="red">-2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> BTT/BTC</td>
                                                        <td>0.00002303</td>
                                                        <td className="red">-1.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> LTC/BTC</td>
                                                        <td>0.03520103</td>
                                                        <td className="green">+1.5%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> TRX/BTC</td>
                                                        <td>0.00330103</td>
                                                        <td className="red">-3.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> BSV/BTC</td>
                                                        <td>0.00300103</td>
                                                        <td className="green">+2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> COTI/BTC</td>
                                                        <td>0.003500103</td>
                                                        <td className="green">+2.85%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> XYT/BTC</td>
                                                        <td>0.00003103</td>
                                                        <td className="green">+3.55%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> BNB/BTC</td>
                                                        <td>0.003500103</td>
                                                        <td className="red">-2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> XMR/BTC</td>
                                                        <td>0.003500103</td>
                                                        <td className="red">-1.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> TRY/BTC</td>
                                                        <td>0.00000123</td>
                                                        <td className="red">-2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> ADA/BTC</td>
                                                        <td>0.00050103</td>
                                                        <td className="green">+5.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> NEO/BTC</td>
                                                        <td>0.00340103</td>
                                                        <td className="red">-1.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> XLM/BTC</td>
                                                        <td>0.00035103</td>
                                                        <td className="green">+5.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> ENQ/BTC</td>
                                                        <td>0.00354103</td>
                                                        <td className="green">+2.02%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> AVA/BTC</td>
                                                        <td>0.02535103</td>
                                                        <td className="green">+3.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> AMB/BTC</td>
                                                        <td>0.05335103</td>
                                                        <td className="green">+1.0%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> MAP/BTC</td>
                                                        <td>0.00234103</td>
                                                        <td className="red">-2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> GO/BTC</td>
                                                        <td>0.00354103</td>
                                                        <td className="red">-6.50%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> KICK/BTC</td>
                                                        <td>0.02053103</td>
                                                        <td className="red">-6.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> DBC/BTC</td>
                                                        <td>0.02535103</td>
                                                        <td className="green">+7.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> GGC/BTC</td>
                                                        <td>0.00353103</td>
                                                        <td className="red">-4.05%</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="tab-pane fade show" id="ETH" role="tabpanel">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Pairs</th>
                                                        <th>Last Price</th>
                                                        <th>Change</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> BTC/ETH</td>
                                                        <td>0.00020255</td>
                                                        <td className="green">+1.58%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> KCS/ETH</td>
                                                        <td>0.00013192</td>
                                                        <td className="red">-0.6%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> XRP/ETH</td>
                                                        <td>0.00002996</td>
                                                        <td className="red">-0.55%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> VET/ETH</td>
                                                        <td>0.00000103</td>
                                                        <td className="green">+1.8%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> EOS/ETH</td>
                                                        <td>0.00000103</td>
                                                        <td className="red">-2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> BTT/ETH</td>
                                                        <td>0.00002303</td>
                                                        <td className="red">-1.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> LTC/ETH</td>
                                                        <td>0.03520103</td>
                                                        <td className="green">+1.5%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> TRX/ETH</td>
                                                        <td>0.00330103</td>
                                                        <td className="red">-3.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> BSV/ETH</td>
                                                        <td>0.00300103</td>
                                                        <td className="green">+2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> COTI/ETH</td>
                                                        <td>0.003500103</td>
                                                        <td className="green">+2.85%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> XYT/ETH</td>
                                                        <td>0.00003103</td>
                                                        <td className="green">+3.55%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> BNB/ETH</td>
                                                        <td>0.003500103</td>
                                                        <td className="red">-2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> XMR/ETH</td>
                                                        <td>0.003500103</td>
                                                        <td className="red">-1.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> TRY/ETH</td>
                                                        <td>0.00000123</td>
                                                        <td className="red">-2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> ADA/ETH</td>
                                                        <td>0.00050103</td>
                                                        <td className="green">+5.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> NEO/ETH</td>
                                                        <td>0.00340103</td>
                                                        <td className="red">-1.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> XLM/ETH</td>
                                                        <td>0.00035103</td>
                                                        <td className="green">+5.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> ENQ/ETH</td>
                                                        <td>0.00354103</td>
                                                        <td className="green">+2.02%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> AVA/ETH</td>
                                                        <td>0.02535103</td>
                                                        <td className="green">+3.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> AMB/ETH</td>
                                                        <td>0.05335103</td>
                                                        <td className="green">+1.0%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> MAP/ETH</td>
                                                        <td>0.00234103</td>
                                                        <td className="red">-2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> GO/ETH</td>
                                                        <td>0.00354103</td>
                                                        <td className="red">-6.50%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> KICK/ETH</td>
                                                        <td>0.02053103</td>
                                                        <td className="red">-6.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> DBC/ETH</td>
                                                        <td>0.02535103</td>
                                                        <td className="green">+7.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> GGC/ETH</td>
                                                        <td>0.00353103</td>
                                                        <td className="red">-4.05%</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="tab-pane fade show" id="NEO" role="tabpanel">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Pairs</th>
                                                        <th>Last Price</th>
                                                        <th>Change</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> ETH/NEO</td>
                                                        <td>0.00350255</td>
                                                        <td className="red">-6.58%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> KCS/NEO</td>
                                                        <td>0.00013192</td>
                                                        <td className="green">+0.6%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> XRP/NEO</td>
                                                        <td>0.00002996</td>
                                                        <td className="red">-0.55%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> VET/NEO</td>
                                                        <td>0.00000103</td>
                                                        <td className="green">+1.8%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> EOS/NEO</td>
                                                        <td>0.00000103</td>
                                                        <td className="red">-2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> BTT/NEO</td>
                                                        <td>0.00002303</td>
                                                        <td className="red">-1.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> LTC/NEO</td>
                                                        <td>0.03520103</td>
                                                        <td className="green">+1.5%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> TRX/NEO</td>
                                                        <td>0.00330103</td>
                                                        <td className="red">-3.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> BSV/NEO</td>
                                                        <td>0.00300103</td>
                                                        <td className="green">+2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> COTI/NEO</td>
                                                        <td>0.003500103</td>
                                                        <td className="green">+2.85%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> XYT/NEO</td>
                                                        <td>0.00003103</td>
                                                        <td className="green">+3.55%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> BNB/NEO</td>
                                                        <td>0.003500103</td>
                                                        <td className="red">-2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> XMR/NEO</td>
                                                        <td>0.003500103</td>
                                                        <td className="red">-1.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> TRY/NEO</td>
                                                        <td>0.00000123</td>
                                                        <td className="red">-2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> ADA/NEO</td>
                                                        <td>0.00050103</td>
                                                        <td className="green">+5.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> NEO/NEO</td>
                                                        <td>0.00340103</td>
                                                        <td className="red">-1.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> XLM/NEO</td>
                                                        <td>0.00035103</td>
                                                        <td className="green">+5.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> ENQ/NEO</td>
                                                        <td>0.00354103</td>
                                                        <td className="green">+2.02%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> AVA/NEO</td>
                                                        <td>0.02535103</td>
                                                        <td className="green">+3.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> AMB/NEO</td>
                                                        <td>0.05335103</td>
                                                        <td className="green">+1.0%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> MAP/NEO</td>
                                                        <td>0.00234103</td>
                                                        <td className="red">-2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> GO/NEO</td>
                                                        <td>0.00354103</td>
                                                        <td className="red">-6.50%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> KICK/NEO</td>
                                                        <td>0.02053103</td>
                                                        <td className="red">-6.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> DBC/NEO</td>
                                                        <td>0.02535103</td>
                                                        <td className="green">+7.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> GGC/NEO</td>
                                                        <td>0.00353103</td>
                                                        <td className="red">-4.05%</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="tab-pane fade show" id="USDT" role="tabpanel">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Pairs</th>
                                                        <th>Last Price</th>
                                                        <th>Change</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> ETH/USDT</td>
                                                        <td>0.00350255</td>
                                                        <td className="red">-2.58%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> KCS/USDT</td>
                                                        <td>0.00013192</td>
                                                        <td className="green">+6.6%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> XRP/USDT</td>
                                                        <td>0.00002996</td>
                                                        <td className="red">-0.55%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> VET/USDT</td>
                                                        <td>0.00000103</td>
                                                        <td className="green">+1.8%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> EOS/USDT</td>
                                                        <td>0.00000103</td>
                                                        <td className="red">-2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> BTT/USDT</td>
                                                        <td>0.00002303</td>
                                                        <td className="red">-1.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> LTC/USDT</td>
                                                        <td>0.03520103</td>
                                                        <td className="green">+1.5%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> TRX/USDT</td>
                                                        <td>0.00330103</td>
                                                        <td className="red">-3.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> BSV/USDT</td>
                                                        <td>0.00300103</td>
                                                        <td className="green">+2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> COTI/USDT</td>
                                                        <td>0.003500103</td>
                                                        <td className="green">+2.85%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> XYT/USDT</td>
                                                        <td>0.00003103</td>
                                                        <td className="green">+3.55%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> BNB/USDT</td>
                                                        <td>0.003500103</td>
                                                        <td className="red">-2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> XMR/USDT</td>
                                                        <td>0.003500103</td>
                                                        <td className="red">-1.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> TRY/USDT</td>
                                                        <td>0.00000123</td>
                                                        <td className="red">-2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> ADA/USDT</td>
                                                        <td>0.00050103</td>
                                                        <td className="green">+5.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> USDT/USDT</td>
                                                        <td>0.00340103</td>
                                                        <td className="red">-1.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> XLM/USDT</td>
                                                        <td>0.00035103</td>
                                                        <td className="green">+5.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> ENQ/USDT</td>
                                                        <td>0.00354103</td>
                                                        <td className="green">+2.02%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> AVA/USDT</td>
                                                        <td>0.02535103</td>
                                                        <td className="green">+3.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> AMB/USDT</td>
                                                        <td>0.05335103</td>
                                                        <td className="green">+1.0%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> MAP/USDT</td>
                                                        <td>0.00234103</td>
                                                        <td className="red">-2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> GO/USDT</td>
                                                        <td>0.00354103</td>
                                                        <td className="red">-6.50%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> KICK/USDT</td>
                                                        <td>0.02053103</td>
                                                        <td className="red">-6.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> DBC/USDT</td>
                                                        <td>0.02535103</td>
                                                        <td className="green">+7.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> GGC/USDT</td>
                                                        <td>0.00353103</td>
                                                        <td className="red">-4.05%</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="tab-pane fade show" id="DAI" role="tabpanel">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Pairs</th>
                                                        <th>Last Price</th>
                                                        <th>Change</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> ETH/DAI</td>
                                                        <td>0.05320255</td>
                                                        <td className="green">+6.58%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> KCS/DAI</td>
                                                        <td>0.00013192</td>
                                                        <td className="green">+0.6%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> XRP/DAI</td>
                                                        <td>0.00002996</td>
                                                        <td className="red">-0.55%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> VET/DAI</td>
                                                        <td>0.00000103</td>
                                                        <td className="green">+1.8%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> EOS/DAI</td>
                                                        <td>0.00000103</td>
                                                        <td className="red">-2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> BTT/DAI</td>
                                                        <td>0.00002303</td>
                                                        <td className="red">-1.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> LTC/DAI</td>
                                                        <td>0.03520103</td>
                                                        <td className="green">+1.5%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> TRX/DAI</td>
                                                        <td>0.00330103</td>
                                                        <td className="red">-3.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> BSV/DAI</td>
                                                        <td>0.00300103</td>
                                                        <td className="green">+2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> COTI/DAI</td>
                                                        <td>0.003500103</td>
                                                        <td className="green">+2.85%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> XYT/DAI</td>
                                                        <td>0.00003103</td>
                                                        <td className="green">+3.55%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> BNB/DAI</td>
                                                        <td>0.003500103</td>
                                                        <td className="red">-2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> XMR/DAI</td>
                                                        <td>0.003500103</td>
                                                        <td className="red">-1.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> TRY/DAI</td>
                                                        <td>0.00000123</td>
                                                        <td className="red">-2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> ADA/DAI</td>
                                                        <td>0.00050103</td>
                                                        <td className="green">+5.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> DAI/DAI</td>
                                                        <td>0.00340103</td>
                                                        <td className="red">-1.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> XLM/DAI</td>
                                                        <td>0.00035103</td>
                                                        <td className="green">+5.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> ENQ/DAI</td>
                                                        <td>0.00354103</td>
                                                        <td className="green">+2.02%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> AVA/DAI</td>
                                                        <td>0.02535103</td>
                                                        <td className="green">+3.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> AMB/DAI</td>
                                                        <td>0.05335103</td>
                                                        <td className="green">+1.0%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> MAP/DAI</td>
                                                        <td>0.00234103</td>
                                                        <td className="red">-2.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> GO/DAI</td>
                                                        <td>0.00354103</td>
                                                        <td className="red">-6.50%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> KICK/DAI</td>
                                                        <td>0.02053103</td>
                                                        <td className="red">-6.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> DBC/DAI</td>
                                                        <td>0.02535103</td>
                                                        <td className="green">+7.05%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><i className="mdi mdi-star"></i> GGC/DAI</td>
                                                        <td>0.00353103</td>
                                                        <td className="red">-4.05%</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

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
