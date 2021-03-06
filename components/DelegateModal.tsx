import { FunctionComponent, useState } from 'react'
import useMangoStore from '../stores/useMangoStore'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import Input from './Input'
import Button from './Button'
import Modal from './Modal'
import { ElementTitle } from './styles'
import { notify } from '../utils/notifications'
import { useTranslation } from 'next-i18next'
import { PublicKey } from '@solana/web3.js'

interface DelegateModalProps {
  delegate?: PublicKey
  isOpen: boolean
  onClose?: (x?: any) => void
}

const DelegateModal: FunctionComponent<DelegateModalProps> = ({
  delegate,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation(['common', 'delegate'])

  const [keyBase58, setKeyBase58] = useState(
    // @ts-ignore
    delegate.equals(PublicKey.default) ? '' : delegate.toBase58()
  )
  const [invalidKeyMessage, setInvalidKeyMessage] = useState('')
  const mangoGroup = useMangoStore((s) => s.selectedMangoGroup.current)
  const mangoAccount = useMangoStore((s) => s.selectedMangoAccount.current)
  const mangoClient = useMangoStore((s) => s.connection.client)
  const actions = useMangoStore((s) => s.actions)

  const setDelegate = async () => {
    // @ts-ignore
    const wallet = useMangoStore.getState().wallet.current

    try {
      const key = keyBase58.length
        ? new PublicKey(keyBase58)
        : PublicKey.default
      /* const txid = await mangoClient.setDelegate(
        mangoGroup,
        mangoAccount,
        wallet,
        key
      ) */
      actions.reloadMangoAccount()
      // @ts-ignore
      onClose()
    /*   notify({
        title: t('delegate:delegate-updated'),
        txid,
      }) */
    } catch (err) {
      console.warn('Error setting delegate key:', err)
     /*  notify({
        title: t('delegate:set-error'),
        description: `${err}`,
        txid: err.txid,
        type: 'error',
      }) */
    }
  }

  const validateKeyInput = () => {
    if (keyBase58.length != 44 && keyBase58.length != 0) {
      setInvalidKeyMessage(t('delegate:invalid-key'))
      return false
    } else {
      setInvalidKeyMessage('')
      return true
    }
  }

  const onChangeKeyInput = (name: any) => {
    setKeyBase58(name)
    validateKeyInput()
  }

  return (
    // @ts-ignore
    <Modal onClose={onClose} isOpen={isOpen}>
      <Modal.Header>
        <div className="flex items-center">
          <ElementTitle noMarginBottom>
            {t('delegate:delegate-your-account')}
          </ElementTitle>
        </div>
      </Modal.Header>
      <div className="flex items-center justify-center text-th-fgd-3 pb-4">
        <p className="text-center">{t('delegate:info')}</p>
      </div>
      <div className="pb-2 text-th-fgd-1">{t('delegate:public-key')}</div>
      <Input
        type="text"
        className={`border border-th-fgd-4 flex-grow`}
        error={!!invalidKeyMessage}
        value={keyBase58}
        onBlur={validateKeyInput}
        onChange={(e) => onChangeKeyInput(e.target.value)}
      />
      {invalidKeyMessage ? (
        <div className="flex items-center pt-1.5 text-th-red">
          <ExclamationCircleIcon className="h-4 w-4 mr-1.5" />
          {invalidKeyMessage}
        </div>
      ) : null}
      <Button
        onClick={() => setDelegate()}
        disabled={keyBase58.length != 44 && keyBase58.length != 0}
        className="mt-4 w-full"
      >
        {t('delegate:set-delegate')}
      </Button>
    </Modal>
  )
}

export default DelegateModal
