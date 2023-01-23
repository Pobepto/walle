import { useEffect, useState } from 'react'

import { isAddress } from '@ethersproject/address'
import { useBlockchainStore } from '@src/store'

const ENSRegExp =
  /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]+$/i

export const useENS = (addressOrName: string) => {
  const isValidAddress = isAddress(addressOrName)

  const provider = useBlockchainStore((store) => store.provider)

  const [state, setState] = useState({
    loading: false,
    address: isValidAddress ? addressOrName : null,
  })

  useEffect(() => {
    const resolve = async () => {
      try {
        setState({
          loading: true,
          address: state.address,
        })

        const address = await provider.resolveName(addressOrName)

        setState({
          loading: false,
          address,
        })
      } catch {
        setState({
          loading: false,
          address: state.address,
        })
      }
    }

    if (!isValidAddress) {
      const isValidENS = addressOrName && ENSRegExp.test(addressOrName)

      isValidENS && resolve()
    }
  }, [addressOrName])

  return {
    ...state,
    name: isValidAddress ? null : addressOrName,
  }
}
