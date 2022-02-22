/* eslint-disable @next/next/no-img-element */
import { SetStateAction, useCallback, useState } from 'react'
import {
  getTokenBySymbol,
  ZERO_I80F48,
  I80F48,
} from '@blockworks-foundation/mango-client'
import useMangoStore from '../../stores/useMangoStore'
import { useBalances } from '../../hooks/useBalances'
import {
  formatUsdValue,
  i80f48ToPercent,
  tokenPrecision,
} from '../../utils/index'
import WithdrawModal from '../WithdrawModal'
import Button from '../Button'
import DepositModal from '../DepositModal'
import { useViewport } from '../../hooks/useViewport'
import { breakpoints } from '../TradePageGrid'
import { Table, Td, Th, TrBody, TrHead } from '../TableElements'
import { ExpandableRow } from '../TableElements'
import MobileTableHeader from '../mobile/MobileTableHeader'
import { useTranslation } from 'next-i18next'
import EmptyState from '../EmptyState'
import { LinkIcon } from '@heroicons/react/outline'
import { walletSelector } from '../../stores/selectors'

export default function AccountBorrows() {
  const { t } = useTranslation('common')
  const balances = useBalances()
  const mangoGroup = useMangoStore((s) => s.selectedMangoGroup.current)
  const mangoCache = useMangoStore((s) => s.selectedMangoGroup.cache)
  const mangoConfig = useMangoStore((s) => s.selectedMangoGroup.config)
  const mangoAccount = useMangoStore((s) => s.selectedMangoAccount.current)
  const wallet = useMangoStore(walletSelector)
  const loadingMangoAccount = useMangoStore(
    (s) => s.selectedMangoAccount.initialLoad
  )
  const connected = useMangoStore((s) => s.wallet.connected)

  const [borrowSymbol, setBorrowSymbol] = useState('')
  const [depositToSettle, setDepositToSettle] = useState(null)
  const [showBorrowModal, setShowBorrowModal] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const { width } = useViewport()
  const isMobile = width ? width < breakpoints.sm : false// @ts-ignore
  const canWithdraw = mangoAccount?.owner.equals(wallet.publicKey)

  const handleCloseWithdraw = useCallback(() => {
    setShowBorrowModal(false)
  }, [])

  const handleCloseDeposit = useCallback(() => {
    setShowDepositModal(false)
    setDepositToSettle(null)
  }, [])

  const handleShowBorrow = (symbol: SetStateAction<string>) => {
    setBorrowSymbol(symbol)
    setShowBorrowModal(true)
  }

  const handleShowDeposit = (symbol: string, amount: string) => {// @ts-ignore
    setDepositToSettle({ symbol: symbol, amount: amount })
    setShowDepositModal(true)
  }

  return (
    <>
      <div className="pb-2 text-th-fgd-1 text-lg">{t('your-borrows')}</div>
      {/* TODO: calculate LiabsVal without perp markets
        <div className="border border-th-red flex items-center justify-between p-2 rounded">
          <div className="pr-4 text-xs text-th-fgd-3">{t('total-borrow-value')}:</div>
          <span>
            {formatUsdValue(+mangoAccount.getLiabsVal(mangoGroup, mangoCache))}
          </span>
        </div> */}
      <div className="flex flex-col pb-2 pt-4">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="align-middle inline-block min-w-full sm:px-6 lg:px-8">
            {mangoGroup && mangoAccount ? (
              balances.find((b:any) => b.borrows.gt(ZERO_I80F48)) ? (
                !isMobile ? (
                  <Table>
                    <thead>
                      <TrHead>
                        <Th>{t('asset')}</Th>
                        <Th>{t('balance')}</Th>
                        <Th>{t('value')}</Th>
                        <Th>{t('borrow-rate')} (APR)</Th>
                      </TrHead>
                    </thead>
                    <tbody>
                      {balances
                        .filter((assets:any) => assets.borrows.gt(ZERO_I80F48))
                        .map((asset) => {
                          const token = getTokenBySymbol(
                            mangoConfig,
                            asset.symbol
                          )
                          const tokenIndex = mangoGroup.getTokenIndex(
                            token.mintKey
                          )
                          return (
                            <TrBody key={tokenIndex}>
                              <Td>
                                <div className="flex items-center">
                                  <img
                                    alt=""
                                    width="20"
                                    height="20"
                                    src={`/assets/icons/${asset.symbol.toLowerCase()}.svg`}
                                    className={`mr-2.5`}
                                  />
                                  <div>{asset.symbol}</div>
                                </div>
                              </Td>
                              <Td>{
                              // @ts-ignore
                              asset.borrows.toFixed()}</Td>
                              <Td>
                                {formatUsdValue(
                                  // @ts-ignore
                                  asset.borrows
                                    .mul(
                                      mangoGroup.getPrice(
                                        tokenIndex,
                                        mangoCache
                                      )
                                    )
                                    .toNumber()
                                )}
                              </Td>
                              <Td>
                                <span className={`text-th-red`}>
                                  {(
                                    mangoGroup
                                      .getBorrowRate(tokenIndex)
                                      .toNumber() * 100
                                  ).toFixed(2)}
                                  %
                                </span>
                              </Td>
                              <Td>
                                <div className={`flex justify-end`}>
                                  <Button
                                    onClick={() =>
                                      handleShowDeposit(
                                        asset.symbol,
                                        // @ts-ignore
                                        asset.borrows.toFixed()
                                      )
                                    }
                                    className="ml-3 text-xs pt-0 pb-0 h-8 pl-3 pr-3"
                                    disabled={!connected || loadingMangoAccount}
                                  >
                                    {t('repay')}
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleShowBorrow(asset.symbol)
                                    }
                                    className="ml-3 text-xs pt-0 pb-0 h-8 pl-3 pr-3"
                                    disabled={
                                      !connected ||
                                      loadingMangoAccount ||
                                      !canWithdraw
                                    }
                                  >
                                    {t('borrow')}
                                  </Button>
                                </div>
                              </Td>
                            </TrBody>
                          )
                        })}
                    </tbody>
                  </Table>
                ) : (
                  <>
                    <MobileTableHeader
                      colOneHeader={t('asset')}
                      colTwoHeader={t('balance')}
                    />
                    {balances
                    // @ts-ignore
                      .filter((assets) => assets.borrows.gt(ZERO_I80F48))
                      .map((asset, i) => {
                        const token = getTokenBySymbol(
                          mangoConfig,
                          asset.symbol
                        )
                        const tokenIndex = mangoGroup.getTokenIndex(
                          token.mintKey
                        )
                        return (
                          <ExpandableRow
                            buttonTemplate={
                              <div className="flex items-center justify-between text-fgd-1 w-full">
                                <div className="flex items-center text-fgd-1">
                                  <img
                                    alt=""
                                    width="20"
                                    height="20"
                                    src={`/assets/icons/${asset.symbol.toLowerCase()}.svg`}
                                    className={`mr-2.5`}
                                  />

                                  {asset.symbol}
                                </div>
                                <div className="text-fgd-1 text-right">
                                  {
                                  // @ts-ignore
                                  asset.borrows.toFixed(
                                    // @ts-ignore
                                    tokenPrecision[asset.symbol]
                                  )}
                                </div>
                              </div>
                            }
                            key={`${asset.symbol}${i}`}
                            index={i}
                            panelTemplate={
                              <>
                                <div className="grid grid-cols-2 grid-flow-row gap-4 pb-4">
                                  <div className="text-left">
                                    <div className="pb-0.5 text-th-fgd-3 text-xs">
                                      {t('value')}
                                    </div>
                                    {formatUsdValue(// @ts-ignore
                                      asset.borrows
                                        .mul(
                                          mangoGroup.getPrice(
                                            tokenIndex,
                                            mangoCache
                                          )
                                        )
                                        .toNumber()
                                    )}
                                  </div>
                                  <div className="text-left">
                                    <div className="pb-0.5 text-th-fgd-3 text-xs">
                                      {t('borrow-rate')} (APR)
                                    </div>
                                    <span className={`text-th-red`}>
                                      {(
                                        mangoGroup
                                          .getBorrowRate(tokenIndex)
                                          .toNumber() * 100
                                      ).toFixed(2)}
                                      %
                                    </span>
                                  </div>
                                </div>

                                <div className="flex space-x-4">
                                  <Button
                                    onClick={() =>
                                      handleShowDeposit(
                                        asset.symbol,// @ts-ignore
                                        asset.borrows.toFixed()
                                      )
                                    }
                                    className="text-xs pt-0 pb-0 h-8 w-full"
                                    disabled={!connected || loadingMangoAccount}
                                  >
                                    {t('repay')}
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleShowBorrow(asset.symbol)
                                    }
                                    className="text-xs pt-0 pb-0 h-8 w-full"
                                    disabled={
                                      !connected ||
                                      loadingMangoAccount ||
                                      !canWithdraw
                                    }
                                  >
                                    {t('borrow')}
                                  </Button>
                                </div>
                              </>
                            }
                          />
                        )
                      })}
                  </>
                )
              ) : (
                <div
                  className={`w-full text-center py-6 bg-th-bkg-1 text-th-fgd-3 rounded-md`}
                >
                  {t('no-borrows')}
                </div>
              )
            ) : (
              <EmptyState
                buttonText={t('connect')}
                desc={t('connect-view')}
                icon={<LinkIcon />}// @ts-ignore
                onClickButton={() => wallet.connect()}
                title={t('connect-wallet')}
              />
            )}
          </div>
        </div>
      </div>
      <div className="pb-2 pt-8 text-th-fgd-1 text-lg">{t('all-assets')}</div>
      <div className="flex flex-col pb-2 pt-4">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="align-middle inline-block min-w-full sm:px-6 lg:px-8">
            {!isMobile ? (
              <Table>
                <thead>
                  <TrHead>
                    <Th>{t('asset')}</Th>
                    <Th>{t('price')}</Th>
                    <Th>Deposit APR</Th>
                    <Th>Borrow APR</Th>
                    {mangoAccount ? <Th>{t('max-borrow')}</Th> : null}
                    <Th>{t('liquidity')}</Th>
                  </TrHead>
                </thead>
                <tbody>
                  {mangoConfig.tokens.map((token, i) => {
                    const tokenIndex = mangoGroup.getTokenIndex(token.mintKey)
                    return (
                      <TrBody key={`${token.symbol}${i}`}>
                        <Td>
                          <div className="flex items-center">
                            <img
                              alt=""
                              width="20"
                              height="20"
                              src={`/assets/icons/${token.symbol.toLowerCase()}.svg`}
                              className={`mr-2.5`}
                            />
                            <div>{token.symbol}</div>
                          </div>
                        </Td>
                        <Td>
                          {formatUsdValue(
                            mangoGroup
                              .getPrice(tokenIndex, mangoCache)
                              .toNumber()
                          )}
                        </Td>
                        <Td>
                          <span className={`text-th-green`}>
                            {i80f48ToPercent(
                              mangoGroup.getDepositRate(tokenIndex)
                            ).toFixed(2)}
                            %
                          </span>
                        </Td>
                        <Td>
                          <span className={`text-th-red`}>
                            {i80f48ToPercent(
                              mangoGroup.getBorrowRate(tokenIndex)
                            ).toFixed(2)}
                            %
                          </span>
                        </Td>
                        {mangoAccount ? (
                          <Td>
                            {mangoAccount
                              .getMaxWithBorrowForToken(
                                mangoGroup,
                                mangoCache,
                                tokenIndex
                              )
                              .mul(I80F48.fromString('0.995'))
                              .toNumber() > 0
                              ? mangoAccount
                                  .getMaxWithBorrowForToken(
                                    mangoGroup,
                                    mangoCache,
                                    tokenIndex
                                  )
                                  .mul(I80F48.fromString('0.995'))
                                  .toNumber()
                                  .toLocaleString(undefined, {
                                    minimumFractionDigits:// @ts-ignore
                                      tokenPrecision[token.symbol],
                                    maximumFractionDigits:// @ts-ignore
                                      tokenPrecision[token.symbol],
                                  })
                              : 0}
                          </Td>
                        ) : null}
                        <Td>
                          {mangoGroup
                            .getUiTotalDeposit(tokenIndex)
                            .sub(mangoGroup.getUiTotalBorrow(tokenIndex))
                            .toNumber()
                            .toLocaleString(undefined, {
                              minimumFractionDigits:// @ts-ignore
                                tokenPrecision[token.symbol],
                              maximumFractionDigits:// @ts-ignore
                                tokenPrecision[token.symbol],
                            })}
                        </Td>
                        <Td>
                          <div className={`flex justify-end`}>
                            <Button
                              onClick={() => handleShowBorrow(token.symbol)}
                              className="text-xs pt-0 pb-0 h-8 pl-3 pr-3 ml-3"
                              disabled={
                                !connected ||
                                loadingMangoAccount ||
                                !canWithdraw
                              }
                            >
                              {t('borrow')}
                            </Button>
                          </div>
                        </Td>
                      </TrBody>
                    )
                  })}
                </tbody>
              </Table>
            ) : (
              <>
                <MobileTableHeader
                  colOneHeader={t('asset')}
                  colTwoHeader={`${t('deposit-rate')}`}
                  colThreeHeader={`${t('borrow-rate')}`}
                />
                {mangoConfig.tokens.map((token, i) => {
                  const tokenIndex = mangoGroup.getTokenIndex(token.mintKey)
                  return (
                    <ExpandableRow
                      buttonTemplate={
                        <div className="flex items-center justify-between text-fgd-1 w-full">
                          <div className="flex items-center">
                            <img
                              alt=""
                              width="20"
                              height="20"
                              src={`/assets/icons/${token.symbol.toLowerCase()}.svg`}
                              className={`mr-2.5`}
                            />

                            {token.symbol}
                          </div>
                          <div className="text-fgd-1 text-right">
                            <span className={`text-th-green`}>
                              {i80f48ToPercent(
                                mangoGroup.getDepositRate(tokenIndex)
                              ).toFixed(2)}
                              %
                            </span>
                          </div>
                          <div className="text-fgd-1 text-right">
                            <span className={`text-th-red`}>
                              {i80f48ToPercent(
                                mangoGroup.getBorrowRate(tokenIndex)
                              ).toFixed(2)}
                              %
                            </span>
                          </div>
                        </div>
                      }
                      key={`${token.symbol}${i}`}
                      index={i}
                      panelTemplate={
                        <div className="grid grid-cols-2 grid-flow-row gap-4">
                          <div className="text-left">
                            <div className="pb-0.5 text-th-fgd-3 text-xs">
                              {t('price')}
                            </div>
                            {formatUsdValue(
                              mangoGroup
                                .getPrice(tokenIndex, mangoCache)
                                .toNumber()
                            )}
                          </div>
                          <div className="text-left">
                            <div className="pb-0.5 text-th-fgd-3 text-xs">
                              {t('max-borrow')}
                            </div>
                            {mangoAccount
                              ? mangoAccount
                                  .getMaxWithBorrowForToken(
                                    mangoGroup,
                                    mangoCache,
                                    tokenIndex
                                  )
                                  .mul(I80F48.fromString('0.995'))
                                  .toNumber()
                                  .toLocaleString(undefined, {
                                    minimumFractionDigits:// @ts-ignore
                                      tokenPrecision[token.symbol],
                                    maximumFractionDigits:// @ts-ignore
                                      tokenPrecision[token.symbol],
                                  })
                              : null}
                          </div>
                          <div className="text-left">
                            <div className="pb-0.5 text-th-fgd-3 text-xs">
                              {t('liquidity')}
                            </div>
                            {mangoGroup
                              .getUiTotalDeposit(tokenIndex)
                              .sub(mangoGroup.getUiTotalBorrow(tokenIndex))
                              .toNumber()
                              .toLocaleString(undefined, {
                                minimumFractionDigits:// @ts-ignore
                                  tokenPrecision[token.symbol],
                                maximumFractionDigits:// @ts-ignore
                                  tokenPrecision[token.symbol],
                              })}
                          </div>
                          <div className="" />
                          <div className="">
                            <Button
                              onClick={() => handleShowBorrow(token.symbol)}
                              className="text-xs pt-0 pb-0 h-8 w-full"
                              disabled={
                                !connected ||
                                loadingMangoAccount ||
                                !canWithdraw
                              }
                            >
                              {t('borrow')}
                            </Button>
                          </div>
                        </div>
                      }
                    />
                  )
                })}
              </>
            )}
          </div>
        </div>
      </div>
      {showBorrowModal && (
        <WithdrawModal
          isOpen={showBorrowModal}
          onClose={handleCloseWithdraw}
          tokenSymbol={borrowSymbol}
          title={t('borrow-withdraw')}
          borrow
        />
      )}
      {showDepositModal && (
        <DepositModal
          isOpen={showDepositModal}
          onClose={handleCloseDeposit}// @ts-ignore
          repayAmount={depositToSettle.amount}// @ts-ignore
          tokenSymbol={depositToSettle.symbol}
        />
      )}
    </>
  )
}
