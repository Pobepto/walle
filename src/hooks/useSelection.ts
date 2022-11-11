import { Key, useStdin } from 'ink'
import React, { useEffect, useState } from 'react'
import { clamp } from '@utils/clamp'
import { useInput } from './useInput'

export type SuperKey = `meta+${keyof Key}` | keyof Key

// TODO: too many arguments, refactor
export const useSelection = (
  amount: number,
  prevKey: SuperKey | SuperKey[],
  nextKey: SuperKey | SuperKey[],
  isActive?: boolean,
  looped?: boolean,
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

  const { stdin } = useStdin()

  stdin?.on('data', (data) => {
    console.log('data', data.toString('hex'))
  })

  const prevent = useInput((key) => {
    console.log(key)
    // {
    //   upArrow: false,
    //   downArrow: false,
    //   leftArrow: false,
    //   rightArrow: false,
    //   pageDown: false,
    //   pageUp: false,
    //   return: false,
    //   escape: false,
    //   ctrl: false,
    //   shift: false,
    //   tab: false,
    //   backspace: false,
    //   delete: false,
    //   meta: true
    // }
    const prevKeys = Array.isArray(prevKey) ? prevKey : [prevKey]
    const nextKeys = Array.isArray(nextKey) ? nextKey : [nextKey]

    const handleSuperKey = (superKey: SuperKey) => {
      const keys = superKey.split('+') as (keyof Key)[]
      return keys.every((k) => key[k])
    }

    if (prevKeys.some(handleSuperKey)) {
      setSelection((i) => clamp(i - 1, 0, maxAmount, looped))
    } else if (nextKeys.some(handleSuperKey)) {
      setSelection((i) => clamp(i + 1, 0, maxAmount, looped))
    }
  }, isActive)

  return [selection, setSelection, prevent]
}
