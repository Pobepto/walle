import { Key, useInput as useInputInk } from 'ink'

export const useInput = (
  handler: (key: Key, input: string) => void,
  preCondition = true
) => {
  useInputInk((input, key) => {
    if (!preCondition) return

    handler(key, input)
  })
}
