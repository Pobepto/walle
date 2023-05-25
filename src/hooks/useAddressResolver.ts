import { useEffect, useState } from 'react'
import { Nullable } from 'tsdef'

import { useBlockchainStore } from '@src/store'

import { isAddress, Rule } from './useForm'

const ENSRegExp =
  /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]+$/i

export const isENS = (name: string) => {
  return name && ENSRegExp.test(name)
}

export const useAddressResolver = () => {
  const provider = useBlockchainStore((store) => store.provider)

  const [state, setState] = useState<{
    loading: boolean
    resolvedAddress: Nullable<string>
  }>({
    loading: false,
    resolvedAddress: null,
  })

  const rule: Rule<any> = (value, data) => {
    if (!state.resolvedAddress) {
      if (isENS(value)) {
        return 'Address for this name not found'
      }

      return isAddress()(value, data)
    }
  }

  const resolve = async (addressOrName: string) => {
    if (!addressOrName || !isENS(addressOrName)) {
      return Promise.resolve()
    }

    try {
      setState({ resolvedAddress: null, loading: true })

      const resolvedAddress = await provider.resolveName(addressOrName)

      setState({ resolvedAddress, loading: false })
    } catch {
      setState({ resolvedAddress: null, loading: false })
    }

    return state
  }

  const useResolve = (addressOrName: string) => {
    useEffect(() => {
      resolve(addressOrName)
    }, [addressOrName])
  }

  return {
    rule,
    resolve,
    useResolve,
    ...state,
  }
}
