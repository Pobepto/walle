import { Key, useInput as useInputInk } from 'ink'

export const useInput = (
  handler: (key: Key, input: string) => void,
  focused = true
) => {
  useInputInk((input, key) => {
    handler(key, input)
  }, { isActive: focused })
}
