import React from 'react'
import { parseUnits } from 'ethers'

import { useContract } from '@src/hooks'
import { ROUTE, useNavigate, useRouteData } from '@src/routes'
import { useTokensStore } from '@src/store'
import { ERC20_ABI } from '@src/store/blockchain/interfaces'

import { TransferForm, TransferInputs } from './TransferForm'

export const TokenTransfer: React.FC = () => {
  const navigate = useNavigate()
  const balances = useTokensStore((store) => store.balances)
  const token = useRouteData<ROUTE.TOKEN_TRANSFER>()
  const ERC20 = useContract(token.address, ERC20_ABI)

  const hasBalance = balances.has(token.address)
  const balance = balances.get(token.address) ?? null

  const onTransfer = async (data: TransferInputs) => {
    const amount = parseUnits(data.amount, token.decimals)
    const populatedTx = await ERC20.transfer.populateTransaction(
      data.receiver,
      amount.toString(),
    )

    navigate(ROUTE.CONFIRM_TRANSACTION, {
      target: ERC20,
      populatedTx,
    })
  }

  return (
    <TransferForm
      title={`Transfer ${token.name} (${token.symbol})`}
      balance={balance}
      decimals={token.decimals}
      balanceIsLoading={!hasBalance}
      onTransfer={onTransfer}
    />
  )
}
