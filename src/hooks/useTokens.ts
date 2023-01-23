import { useMemo } from 'react'

import { useTokensStore } from '@src/store'
import { useBlockchainStore } from '@store/blockchain'

export const useTokens = () => {
  const chainId = useBlockchainStore((store) => store.chainId)
  const tokens = useTokensStore((store) => store.tokens)

  return useMemo(() => {
    return tokens.filter((token) => token.chainId === chainId)
  }, [tokens, chainId])
}
