import { JupiterProvider } from '@jup-ag/react-hook'
import type { NextPage } from "next";
import { useEffect, useState } from 'react'
import useMangoStore from '../stores/useMangoStore'
import PageBodyContainer from '../components/PageBodyContainer'
import TopBar from '../components/TopBar'
import {
  actionsSelector,
  connectionSelector,
  walletConnectedSelector,
  walletSelector,
} from '../stores/selectors'
import JupiterForm from '../components/JupiterForm'
import { zeroKey } from '@blockworks-foundation/mango-client'
import Head from 'next/head'
import MobileLogo from '../components/MobileLogo'
import SidebarLogo from '../components/SidebarLogo'
import SidebarNavigation from '../components/SidebarNavigation'




interface Props {

}

const SwapMango: NextPage<Props> = (props) => {

  const [isExpanded, toggleExpansion] = useState(true);
  console.log('SwapMango props', isExpanded)

  const connection = useMangoStore(connectionSelector)
  const connected = useMangoStore(walletConnectedSelector)
  const wallet = useMangoStore(walletSelector)
  const actions = useMangoStore(actionsSelector)
    console.log("connected")
  console.log(connected)



  useEffect(() => {
    if (connected) {
      actions.fetchWalletTokens()
    }
  }, [connected])

  if (!connection) return null

  const userPublicKey =
    wallet?.publicKey && !zeroKey.equals(wallet.publicKey)
      ? wallet.publicKey
      : null

  return (

  <div className="relative min-h-screen md:flex">
  <Head>
    <title>Lagrange.fi - Swap</title>
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
  </Head>
  <div className="flex justify-between px-4 py-2 text-gray-100 bg-gray-800 md:hidden">
    <MobileLogo />
    <button
      onClick={() => toggleExpansion(!isExpanded)}
      className="p-4 mobile-menu-button focus:outline-none focus:bg-gray-700"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  </div>
  <div
    className={`${
      isExpanded ? `-translate-x-full` : `translate-x-0`
    } sidebar bg-white text-gray-700 w-80 space-y-6 px-6 py-4 z-50 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out shadow-xl`}
  >
    <SidebarLogo />

    <SidebarNavigation />
  </div>

  <div className="flex-1 text-xl font-bold bg-gradient-to-r from-lagrangelight to-lagrangedark">
    <TopBar />
    <div className="flex pt-5 xxl:pl-5 xl:pl-5 lg:pl-5 md:pl-5 xs:pl-0 xs:flex-wrap md:justify-start sm:justify-center xs:justify-center">
      <div>
      <JupiterProvider
      connection={connection}
      cluster="mainnet-beta"// @ts-ignore
      userPublicKey={connected ? userPublicKey : null}
    >
      <div className={`bg-th-bkg-1 text-th-fgd-1 transition-all`}>
  
        <PageBodyContainer>
          <div className="grid grid-cols-12">
            <div className="col-span-12 xl:col-span-10 xl:col-start-2 pt-8 pb-3 sm:pb-4 md:pt-10">
              <div className="flex flex-col items-start md:flex-row md:items-end md:justify-between mb-1">
                <h1
                  className={`mb-1.5 md:mb-0 text-th-fgd-1 text-2xl font-semibold`}
                >
                 Swap
                </h1>
                <div className="flex flex-col md:items-end">
                  
               
                </div>
              </div>
            </div>
          </div>

         <JupiterForm /> 
        </PageBodyContainer>
      </div>
    </JupiterProvider> 
      </div>
      <div className="xxl:pl-5 xl:pl-5 lg:pl-5 md:pl-0">

        
      </div>
    </div>
  </div>
</div>

 )
}

export default SwapMango