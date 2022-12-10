import React from 'react'
import { ROUTE, useRouteData, useNavigate } from '@src/routes'
import { useTokensStore } from '@src/store'
import { useContract } from '@src/hooks'
import { ERC20_ABI } from '@src/store/blockchain/interfaces'
import { TransferForm, TransferInputs } from './TransferForm'
import { parseUnits } from '@ethersproject/units'

export const TokenTransfer: React.FC = () => {
  const navigate = useNavigate()
  const balances = useTokensStore((store) => store.balances)
  const balancesIsLoading = useTokensStore((store) => store.balancesIsLoading)
  const token = useRouteData<ROUTE.TOKEN_TRANSFER>()
  const ERC20 = useContract(token.address, ERC20_ABI)

  const balance = balances.get(token.address) ?? '🤔'

  const onTransfer = async (data: TransferInputs) => {
    const amount = parseUnits(data.amount, token.decimals)
    const populatedTx = await ERC20.populateTransaction.transfer(
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
      title={`${token.name} (${token.symbol})`}
      balance={balance}
      decimals={token.decimals}
      balanceIsLoading={balancesIsLoading}
      onTransfer={onTransfer}
      onBack={() => navigate(ROUTE.TOKEN_ACTIONS, token)}
    />
  )
}
