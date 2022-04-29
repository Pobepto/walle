import { Key } from 'ink'
import { useState } from 'react'
import { useInput } from './useInput'

export const useSelection = (
  amount: number,
  prevKey: keyof Key,
  nextKey: keyof Key,
  isActive = true
) => {
  const [selection, setSelection] = useState(0)

  useInput((key) => {
    if (key[prevKey]) {
      setSelection(i => i === 0 ? amount - 1 : i - 1)
    } else if (key[nextKey]) {
      setSelection(i => i === amount - 1 ? 0 : i + 1)
    }
  }, isActive)

  return selection
}
