import { Key } from 'ink'
import React, { useEffect, useState } from 'react'
import { clamp } from '../utils/clamp'
import { useInput } from './useInput'

// TODO: too many arguments, refactor
export const useSelection = (
  amount: number,
  prevKey: keyof Key | (keyof Key)[],
  nextKey: keyof Key | (keyof Key)[],
  isActive = true,
  looped = true,
): [number, React.Dispatch<React.SetStateAction<number>>, () => void] => {
  const [maxAmount, setMaxAmount] = useState(amount - 1)
  const [selection, setSelection] = useState(0)

  useEffect(() => {
    const newMaxAmount = amount - 1
    if (selection > newMaxAmount) {
      setSelection(newMaxAmount)
    }
    setMaxAmount(newMaxAmount)
  }, [amount])

  const prevent = useInput((key) => {
    const prevKeys = Array.isArray(prevKey) ? prevKey : [prevKey]
    const nextKeys = Array.isArray(nextKey) ? nextKey : [nextKey]

    if (prevKeys.some((k) => key[k])) {
      setSelection((i) => clamp(i - 1, 0, maxAmount, looped))
    } else if (nextKeys.some((k) => key[k])) {
      setSelection((i) => clamp(i + 1, 0, maxAmount, looped))
    }
  }, isActive)

  return [selection, setSelection, prevent]
}
