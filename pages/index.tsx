

import type { NextPage } from 'next';
import { useState, useEffect, Suspense } from 'react';
import styles from '../styles/Loader.module.css';
import React from 'react';


// Lazy load the LandingPage component
const LazyLandingPage = React.lazy(() => import('./landing'));

const Home: NextPage = () => {
  
  return (
    <div className={styles.container}>
      
        <Suspense fallback={<div className={styles.loader}>
        <img src="/assets/images/logo.png" alt="Logo" />
      </div>}>
          <LazyLandingPage />
        </Suspense>

    </div>
  );
};

export default Home;

