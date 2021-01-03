import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to forum!</title>
      </Head>
      <div className="app">
        <header className="flex">
          <h1>Welcome to forum!</h1>
        </header>
        <main>
          <Component {...pageProps} />
        </main>
      </div>
    </>
  );
}

export default CustomApp;
