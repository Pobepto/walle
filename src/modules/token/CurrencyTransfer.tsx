import React from 'react'
import { ROUTE, useNavigate } from '@src/routes'
import { useChain, useNativeBalance } from '@src/hooks'
import { TransferForm, TransferInputs } from './TransferForm'
import { PopulatedTransaction } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'

export const CurrencyTransfer: React.FC = () => {
  const navigate = useNavigate()
  const chain = useChain()
  const [balance, balanceIsLoading] = useNativeBalance()

  const onTransfer = async (data: TransferInputs) => {
    const populatedTx: PopulatedTransaction = {
      to: data.receiver,
      value: BigNumber.from(data.amount).mul(BigNumber.from(10).mul(18)),
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
