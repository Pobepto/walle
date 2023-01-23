import React from 'react'

import { PopulatedTransaction } from '@ethersproject/contracts'
import { parseUnits } from '@ethersproject/units'
import { useChain } from '@src/hooks'
import { ROUTE, useNavigate } from '@src/routes'
import { useBlockchainStore } from '@src/store'

import { TransferForm, TransferInputs } from './TransferForm'

export const CurrencyTransfer: React.FC = () => {
  const navigate = useNavigate()
  const chain = useChain()
  const nativeBalance = useBlockchainStore((store) => store.nativeBalance)

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
      balance={nativeBalance}
      decimals={18}
      balanceIsLoading={!nativeBalance}
      onTransfer={onTransfer}
      onBack={() => navigate(ROUTE.CURRENCY_ACTIONS)}
    />
  )
}
