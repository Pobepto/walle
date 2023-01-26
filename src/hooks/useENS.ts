import { useEffect, useState } from 'react'
import { Nullable } from 'tsdef'

import { useBlockchainStore } from '@src/store'

const ENSRegExp =
  /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]+$/i

export const isENS = (name: string) => {
  return name && ENSRegExp.test(name)
}

export const useENS = (addressOrName: string) => {
  const provider = useBlockchainStore((store) => store.provider)

  const [state, setState] = useState<{
    loading: boolean
    address: Nullable<string>
  }>({
    loading: false,
    address: null,
  })

  const resolve = async (name: string) => {
    try {
      setState({ address: null, loading: true })

      const address = await provider.resolveName(name)

      setState({ address, loading: false })
    } catch {
      setState({ address: null, loading: false })
    }
  }

  useEffect(() => {
    if (isENS(addressOrName)) {
      resolve(addressOrName)
    }
  }, [addressOrName])

  return state
}
