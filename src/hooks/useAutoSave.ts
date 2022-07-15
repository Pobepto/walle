import { useTokensStore } from '@src/store'
import { save, USER_SETTINGS } from '@src/utils'
import { useBlockchainStore } from '@store/blockchain'
import { useEffect } from 'react'

export const useAutoSave = (): void => {
  const chains = useBlockchainStore((store) => store.chains)
  const tokens = useTokensStore((store) => store.tokens)

  useEffect(() => {
    const data = {
      version: '0.0.0',
      store: {
        blockchain: {
          chains,
        },
        tokens: {
          tokens,
        },
      },
    }

    save(JSON.stringify(data, null, 2), USER_SETTINGS)
  }, [chains, tokens])
}
