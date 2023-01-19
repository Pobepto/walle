import { isAddress } from '@ethersproject/address'
import { useBlockchainStore } from '@src/store'
import { useEffect, useState } from 'react'
import { Nullable } from 'tsdef'

export const useENS = (addressOrEns: string) => {
  const provider = useBlockchainStore((store) => store.provider)
  const [address, setAddress] = useState<Nullable<string>>(
    isAddress(addressOrEns) ? addressOrEns : null,
  )
  const [isEns, setIsEns] = useState(false)

  useEffect(() => {
    const resolve = async () => {
      try {
        const address = await provider.resolveName(addressOrEns)

        if (address) {
          setIsEns(true)
          setAddress(address)
        }
      } catch {
        setIsEns(false)
        setAddress(null)
      }
    }

    if (addressOrEns && !isAddress(addressOrEns)) {
      resolve()
    } else {
      setAddress(addressOrEns)
    }
  }, [addressOrEns])

  return {
    address,
    isEns,
  }
}
