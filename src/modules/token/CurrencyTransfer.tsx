import React from 'react'
import { ROUTE, useNavigate } from '@src/routes'
import { useChain, useNativeBalance } from '@src/hooks'
import { TransferForm, TransferInputs } from './TransferForm'
import { PopulatedTransaction } from '@ethersproject/contracts'
import { parseUnits } from '@ethersproject/units'

export const CurrencyTransfer: React.FC = () => {
  const navigate = useNavigate()
  const chain = useChain()
  const [balance, balanceIsLoading] = useNativeBalance()

  const onTransfer = async (data: TransferInputs) => {
    const value = parseUnits(data.amount, 18)

    const populatedTx: PopulatedTransaction = {
      to: data.receiver,
      value,
    }

    navigate(ROUTE.CONFIRM_TRANSACTION, {
      populatedTx,
    })
  }

  return (
    <TransferForm
      title={`${chain.currency}`}
      balance={balance}
      decimals={18}
      balanceIsLoading={balanceIsLoading}
      onTransfer={onTransfer}
      onBack={() => navigate(ROUTE.CURRENCY_ACTIONS)}
    />
  )
}
