import { Key } from 'ink'
import { useInput } from './useInput'

export const useKey = (
  key: keyof Key,
  handler: (input: string) => void,
  focused = true,
) => {
  return useInput((keys, input) => {
    if (keys[key]) {
      handler(input)
    }
  }, focused)
}
