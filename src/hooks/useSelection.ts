import { Key } from 'ink'
import React, { useState } from 'react'
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
  const [selection, setSelection] = useState(0)

  const prevent = useInput((key) => {
    const prevKeys = Array.isArray(prevKey) ? prevKey : [prevKey]
    const nextKeys = Array.isArray(nextKey) ? nextKey : [nextKey]

    if (prevKeys.some((k) => key[k])) {
      setSelection((i) => clamp(i - 1, 0, amount - 1, looped))
    } else if (nextKeys.some((k) => key[k])) {
      setSelection((i) => clamp(i + 1, 0, amount - 1, looped))
    }
  }, isActive)

  return [selection, setSelection, prevent]
}
