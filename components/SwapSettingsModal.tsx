import { SetStateAction, useEffect, useState } from 'react'
import Modal from './Modal'
import { useTranslation } from 'next-i18next'
import Button from './Button'
import ButtonGroup from './ButtonGroup'
import Input from './Input'
import { LinkButton } from './Button'

const slippagePresets = ['0.1', '0.5', '1', '2']

const SwapSettingsModal = ({
  isOpen,
  onClose,
  slippage,
  setSlippage,
}: {
  isOpen: boolean
  onClose?: () => void
  slippage: number
  setSlippage: (x: any) => void
}) => {
  const { t } = useTranslation(['common', 'swap'])
  const [tempSlippage, setTempSlippage] = useState(slippage)
  const [inputValue, setInputValue] = useState(
    tempSlippage ? tempSlippage.toString() : ''
  )
  const [showCustomSlippageForm, setShowCustomSlippageForm] = useState(false)

  const handleSetTempSlippage = (s: SetStateAction<number>) => {
    setTempSlippage(s)
    setInputValue('')
  }

  const handleSave = () => {
    setSlippage(inputValue ? parseFloat(inputValue) : tempSlippage)// @ts-ignore
    onClose()
  }

  useEffect(() => {
    if (!slippagePresets.includes(tempSlippage.toString())) {
      setShowCustomSlippageForm(true)
    }
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideClose>
      <Modal.Header>
        <h2 className="font-bold text-th-fgd-1 text-lg">
          {t('swap:slippage-settings')}
        </h2>
      </Modal.Header>
      <div className="flex justify-between mb-2">
        <div className="text-th-fgd-1 text-xs">{t('swap:slippage')}</div>
        <LinkButton
          className="font-normal text-th-fgd-3 text-xs"
          onClick={() => setShowCustomSlippageForm(!showCustomSlippageForm)}
        >
          {showCustomSlippageForm ? t('presets') : t('custom')}
        </LinkButton>
      </div>
      {showCustomSlippageForm ? (
        <Input
          type="text"
          className="w-full bg-th-bkg-1 focus:outline-none rounded"
          placeholder="0.00"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          suffix="%"
        />
      ) : (
        <ButtonGroup
          activeValue={tempSlippage.toString()}
          className="h-10"
          onChange={(v) => handleSetTempSlippage(v)}
          unit="%"
          values={slippagePresets}
        />
      )}
      <Button className="mt-6 w-full" onClick={handleSave}>
        {t('save')}
      </Button>
    </Modal>
  )
}

export default SwapSettingsModal