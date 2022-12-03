import { Key } from 'ink'
import { useEffect, useState } from 'react'
import { clamp } from '@utils/clamp'
import { useInput, UserInput } from './useInput'

export type SuperKey =
  | `${'meta' | 'ctrl'}+${keyof Key | string}`
  | keyof Key
  | 'any'

export const checkSuperKey = (
  input: UserInput,
  superKey: SuperKey | SuperKey[],
) => {
  const superKeys = Array.isArray(superKey) ? superKey : [superKey]

  return superKeys.some((superKey) => {
    if (superKey === 'any') {
      return true
    }

    const keys = superKey.split('+') as (keyof Key)[]
    return keys.every((k) => input.key[k] || input.raw === k)
  })
}

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

  const prevent = useInput((input) => {
    if (checkSuperKey(input, nextKey)) {
      setSelection((i) => clamp(i + 1, 0, maxAmount, looped))
    }

    if (prevKey && checkSuperKey(input, prevKey)) {
      setSelection((i) => clamp(i - 1, 0, maxAmount, looped))
    }
  }, isActive)

  return [selection, setSelection, prevent] as const
}
