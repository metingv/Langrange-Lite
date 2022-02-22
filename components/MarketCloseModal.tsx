import { FunctionComponent, useState } from 'react'
import useMangoStore from '../stores/useMangoStore'
import { PerpMarket, ZERO_BN } from '@blockworks-foundation/mango-client'
import Button, { LinkButton } from './Button'
import { notify } from '../utils/notifications'
import Loading from './Loading'
import { sleep } from '../utils'
import Modal from './Modal'
import { useTranslation } from 'next-i18next'

interface MarketCloseModalProps {
  onClose: () => void
  isOpen: boolean
  market: PerpMarket
  marketIndex: number
}

const MarketCloseModal: FunctionComponent<MarketCloseModalProps> = ({
  onClose,
  isOpen,
  market,
  marketIndex,
}) => {
  const { t } = useTranslation('common')
  const [submitting, setSubmitting] = useState(false)
  const actions = useMangoStore((s) => s.actions)
  const mangoClient = useMangoStore((s) => s.connection.client)
  // @ts-ignore
  const config = useMangoStore.getState().selectedMarket.config

  async function handleMarketClose() {
    // @ts-ignore
    const mangoAccount = useMangoStore.getState().selectedMangoAccount.current
    // @ts-ignore
    const mangoGroup = useMangoStore.getState().selectedMangoGroup.current
    // @ts-ignore
    const marketConfig = useMangoStore.getState().selectedMarket.config
    const askInfo =
    // @ts-ignore
      useMangoStore.getState().accountInfos[marketConfig.asksKey.toString()]
    const bidInfo =
// @ts-ignore
      useMangoStore.getState().accountInfos[marketConfig.bidsKey.toString()]
      // @ts-ignore
    const wallet = useMangoStore.getState().wallet.current
// @ts-ignore
    const orderbook = useMangoStore.getState().selectedMarket.orderBook
    // @ts-ignore
    const markPrice = useMangoStore.getState().selectedMarket.markPrice
    // @ts-ignore
    const referrerPk = useMangoStore.getState().referrerPk

    // The reference price is the book mid if book is double sided; else mark price
    const bb = orderbook?.bids?.length > 0 && Number(orderbook.bids[0][0])
    const ba = orderbook?.asks?.length > 0 && Number(orderbook.asks[0][0])
    const referencePrice = bb && ba ? (bb + ba) / 2 : markPrice

    if (!wallet || !mangoGroup || !mangoAccount) return
    setSubmitting(true)

    try {
      const perpAccount = mangoAccount.perpAccounts[marketIndex]
      const side = perpAccount.basePosition.gt(ZERO_BN) ? 'sell' : 'buy'
      // send a large size to ensure we are reducing the entire position
      const size =
        Math.abs(market.baseLotsToNumber(perpAccount.basePosition)) * 2

      // hard coded for now; market orders are very dangerous and fault prone
      const maxSlippage: number | undefined = 0.025

      const txid = await mangoClient.placePerpOrder(
        mangoGroup,
        mangoAccount,
        mangoGroup.mangoCache,
        market,
        wallet,
        side,
        referencePrice * (1 + (side === 'buy' ? 1 : -1) * maxSlippage),
        size,
        'ioc',
        0, // client order id
        side === 'buy' ? askInfo : bidInfo,
        true, // reduce only
        referrerPk ? referrerPk : undefined
      )
      await sleep(500)
      actions.reloadMangoAccount()
      notify({ title: t('transaction-sent'), txid })
    } catch (e: any) {
      notify({
        title: t('order-error'),
        description: e.message,
        txid: e.txid,
        type: 'error',
      })
    } finally {
      setSubmitting(false)
      onClose()
    }
  }

  return (
    // @ts-ignore
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className="pb-2 text-th-fgd-1 text-lg">
        {t('close-confirm', { config_name: config.name })}
      </div>
      <div className="pb-6 text-th-fgd-3">{t('price-expect')}</div>
      <div className="flex items-center">
        <Button onClick={handleMarketClose}>
          {submitting ? <Loading /> : <span>{t('close-position')}</span>}
        </Button>
        <LinkButton className="ml-4 text-th-fgd-1" onClick={onClose}>
          {t('cancel')}
        </LinkButton>
      </div>
    </Modal>
  )
}

export default MarketCloseModal
