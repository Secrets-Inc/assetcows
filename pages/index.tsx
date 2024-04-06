import type { NextPage } from 'next';
// import TronGrace from './trongrace';
import { useState, useEffect } from 'react'
import styles from '../styles/Loader.module.css';
import LandingPage from './landing';

const Home: NextPage = () => {
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])
 
  return isClient ? <LandingPage/> : (<div className={styles.container}>
  <div className={styles.loader}>
    <img src="/assets/images/logo.png" alt="Logo" />
  </div>
</div>);
  
};

export default Home;
