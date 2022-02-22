/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */
import { useCallback, useState } from 'react'
import Link from 'next/link'
import { abbreviateAddress } from '../utils/index'
import useLocalStorageState from '../hooks/useLocalStorageState'
import MenuItem from './MenuItem'
import ThemeSwitch from './ThemeSwitch'
import useMangoStore from '../stores/useMangoStore'
import ConnectWalletButton from './ConnectWalletButton'
import NavDropMenu from './NavDropMenu'
import AccountsModal from './AccountsModal'
import LanguageSwitch from './LanguageSwitch'
import { DEFAULT_MARKET_KEY, initialMarket } from './SettingsModal'
import { useTranslation } from 'next-i18next'
import Settings from './Settings'
// @ts-ignore
const StyledNewLabel = ({ children, ...props }) => (
  <div style={{ fontSize: '0.5rem', marginLeft: '1px' }} {...props}>
    {children}
  </div>
)

const TopBar = () => {
  const { t } = useTranslation('common')
  const mangoAccount = useMangoStore((s) => s.selectedMangoAccount.current)
  const wallet = useMangoStore((s) => s.wallet.current)
  const [showAccountsModal, setShowAccountsModal] = useState(false)
  const [defaultMarket] = useLocalStorageState(
    DEFAULT_MARKET_KEY,
    initialMarket
  )

  const handleCloseAccounts = useCallback(() => {
    setShowAccountsModal(false) 
  }, [])

  return (
    <>
      <nav className={`bg-th-bkg-2 border-b border-th-bkg-2`}>
        <div className={`px-4 lg:px-10`}>
          <div className={`flex justify-between h-14`}>
            <div className={`flex`}>
             
              <div className={`hidden md:flex md:items-center md:ml-4`}>
        
                <div className="relative">
                 
                
                </div>
                
              </div>
            </div>
            <div className="flex items-center">
             
            
              <div className="flex">
                <div className="pl-2">
                  <ConnectWalletButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
    </>
  )
}

export default TopBar
