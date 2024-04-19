import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";


const VerifyUsdtPage: NextPage = () => {
    // 
    
  return (
    <>
      <Head key={"verifyusdt-page"}> 
          <meta charSet="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
          <title>AssetProof - Verify Usdt</title>
          <link rel="icon" type="image/png" sizes="16x16" href="/assets/assets/images/favicon.png"/>
          <link rel="stylesheet" href="/assets/vendor/nice-select/css/nice-select.css"/>
          <link rel="stylesheet" href="/assets/vendor/owl-carousel/css/owl.theme.default.css"/>
          <link rel="stylesheet" href="/assets/vendor/owl-carousel/css/owl.carousel.min.css"/>
          <link rel="stylesheet" href="/assets/css/style.css"/>
          <script defer
            src="https://code.jquery.com/jquery-3.3.1.js"
            integrity="sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60="
            crossOrigin="anonymous"></script>
      </Head>

      <div style={{ backgroundImage: "url('assets/images/image.jpg'), linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5))",
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
     
        {/*  */}
        <div className="intro">
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
                                            <h6 className="card-title">Step {'1'}</h6>
                                            <p className="card-text text-white">Verifier Address: {'djfhvvjbjbjgjfhfhfhbhb'}</p>
                                            <p className="card-text text-white">Receiving Email: {'sdf@gmail.com'}</p>
                                        </div>
                                        <div className="card-footer">
                                            {/* <div className="signin-btn"> */}
                                                <a className="btn btn-primary text-white">
                                                Connect Wallet
                                                </a> 
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
      </>);
};

export default VerifyUsdtPage;