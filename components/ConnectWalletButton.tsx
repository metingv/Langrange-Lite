/* eslint-disable @next/next/no-img-element */
import { useCallback, useState } from 'react'
import useMangoStore from '../stores/useMangoStore'
import { Menu } from '@headlessui/react'
import {
  CurrencyDollarIcon,
  DuplicateIcon,
  LogoutIcon,
} from '@heroicons/react/outline'
import { PROVIDER_LOCAL_STORAGE_KEY } from '../hooks/useWallet'
import useLocalStorageState from '../hooks/useLocalStorageState'
import { abbreviateAddress, copyToClipboard } from '../utils'
import WalletSelect from './WalletSelect'
import { WalletIcon, ProfileIcon } from './icons'
import { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
 import { DEFAULT_PROVIDER, WALLET_PROVIDERS } from '../utils/wallet-adapters'

const ConnectWalletButton = () => {
  const { t } = useTranslation('common')
  const wallet = useMangoStore((s) => s.wallet.current)
  const mangoGroup = useMangoStore((s) => s.selectedMangoGroup.current)
  const pfp = useMangoStore((s) => s.wallet.pfp)
  const connected = useMangoStore((s) => s.wallet.connected)
  const set = useMangoStore((s) => s.set)
  const [showAccountsModal, setShowAccountsModal] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState(DEFAULT_PROVIDER.url)
  const [savedProviderUrl] = useLocalStorageState(
    PROVIDER_LOCAL_STORAGE_KEY,
    DEFAULT_PROVIDER.url
  )

  // update in useEffect to prevent SRR error from next.js
  useEffect(() => {
    setSelectedWallet(savedProviderUrl)
  }, [savedProviderUrl])

  const handleWalletConect = () => {
    // @ts-ignore
    wallet.connect()
    set((state) => {
      state.selectedMangoAccount.initialLoad = true
    })
  }

  const handleCloseAccounts = useCallback(() => {
    setShowAccountsModal(false)
  }, [])

  return (
    <>
      {connected && wallet?.publicKey ? (
        <Menu>
          <div className="relative" id="profile-menu-tip">
            <Menu.Button >
              {!pfp?.isAvailable ? (
                   <button
                    className="rounded-none text-th-primary hover:bg-th-bkg-4 focus:outline-none disabled:text-th-fgd-4 disabled:cursor-wait"
                  onClick={() => wallet.disconnect()}
                >
              
                  <div className="pl-2 text-left">
                    <div className="pb-0.5">{t('disconnect')}</div>
                   
                  </div>
                </button>
              ) : (
                     <button
            onClick={handleWalletConect}
            disabled={!wallet || !mangoGroup}
            className="rounded-none text-th-primary hover:bg-th-bkg-4 focus:outline-none disabled:text-th-fgd-4 disabled:cursor-wait"
          >
            <div className="flex flex-row items-center px-3 justify-center h-full default-transition hover:text-th-fgd-1">
           
              <div className="text-left">
                <div className="mb-0.5 whitespace-nowrap">{t('connect')}</div>
                <div className="font-normal text-th-fgd-3 leading-3 tracking-wider text-xxs">
                  {WALLET_PROVIDERS.find((p) => p.url === selectedWallet)?.name}
                </div>
              </div>
            </div>
          </button>
              )}
            </Menu.Button>
           
          </div>
        </Menu>
      ) : (
        <div
          className="bg-th-bkg-1 h-14 flex divide-x divide-th-bkg-3 justify-between"
          id="connect-wallet-tip"
        >
          <button
            onClick={handleWalletConect}
            disabled={!wallet || !mangoGroup}
            className="rounded-none text-th-primary hover:bg-th-bkg-4 focus:outline-none disabled:text-th-fgd-4 disabled:cursor-wait"
          >
            <div className="flex flex-row items-center px-3 justify-center h-full default-transition hover:text-th-fgd-1">
           
              <div className="text-left">
                <div className="mb-0.5 whitespace-nowrap">{t('connect')}</div>
                <div className="font-normal text-th-fgd-3 leading-3 tracking-wider text-xxs">
                  {WALLET_PROVIDERS.find((p) => p.url === selectedWallet)?.name}
                </div>
              </div>
            </div>
          </button>
          <div className="relative">
            <WalletSelect isPrimary />
          </div>
        </div>
      )}
    
    </>
  )
}

export default ConnectWalletButton
