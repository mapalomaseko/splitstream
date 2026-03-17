// ============================================================
// STUDENT 4 — APP WRAPPER
// ============================================================
// This wraps every page with the Web3Provider so all pages
// have access to the wallet connection state.
//
// TASKS:
// [ ] Confirm Web3Provider is imported correctly
// [ ] Import global CSS
// ============================================================

import { Web3Provider } from '../context/Web3Context';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <Web3Provider>
      <Component {...pageProps} />
    </Web3Provider>
  );
}
