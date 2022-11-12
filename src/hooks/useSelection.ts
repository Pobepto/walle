import { Key } from 'ink'
import { useEffect, useState } from 'react'
import { clamp } from '@utils/clamp'
import { useInput } from './useInput'

export type SuperKey = `${'meta' | 'ctrl'}+${keyof Key | string}` | keyof Key

export interface SelectionSettings {
  amount: number
  defaultSelection?: number
  nextKey: SuperKey | SuperKey[]
  prevKey?: SuperKey | SuperKey[]
  isActive?: boolean
  looped?: boolean
}

export const useSelection = ({
  amount,
  defaultSelection = 0,
  prevKey,
  nextKey,
  isActive,
  looped,
}: SelectionSettings) => {
  const [maxAmount, setMaxAmount] = useState(amount - 1)
  const [selection, setSelection] = useState(defaultSelection)

  useEffect(() => {
    const newMaxAmount = amount - 1
    if (selection > newMaxAmount) {
      setSelection(newMaxAmount)
    }
    setMaxAmount(newMaxAmount)
  }, [amount])

  const prevent = useInput((key, input) => {
    const handleSuperKey = (superKey: SuperKey) => {
      const keys = superKey.split('+') as (keyof Key)[]
      return keys.every((k) => key[k] || input === k)
    }

    const nextKeys = Array.isArray(nextKey) ? nextKey : [nextKey]
    if (nextKeys.some(handleSuperKey)) {
      setSelection((i) => clamp(i + 1, 0, maxAmount, looped))
    }

    if (prevKey) {
      const prevKeys = Array.isArray(prevKey) ? prevKey : [prevKey]
      if (prevKeys.some(handleSuperKey)) {
        setSelection((i) => clamp(i - 1, 0, maxAmount, looped))
      }
    }
  }, isActive)

  return [selection, setSelection, prevent] as const
}
