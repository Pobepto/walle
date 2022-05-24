import { Key } from 'ink'
import { useInput } from './useInput'

export const useKey = (
  key: keyof Key | (keyof Key)[],
  handler: (input: string) => void,
  focused = true,
) => {
  return useInput((_keys, input) => {
    const keys = Array.isArray(key) ? key : [key]
    if (keys.some((k) => _keys[k])) {
      handler(input)
    }
  }, focused)
}
