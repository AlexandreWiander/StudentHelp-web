import "../styles/globals.css";
import Head from "next/head";
import Navbar from "../components/Navbar";
import styles from "../styles/Home.module.css";
import type { AppProps } from "next/app";
import LoginCheck from "../components/LoginCheck";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Footer } from "../components/Footer";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <LoginCheck>
        <div className={styles.body}>
          <Head>
            <title>StudentHelp</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Navbar />
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <main className={styles.main}>
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </LoginCheck>
    </SessionProvider>
  );
}
