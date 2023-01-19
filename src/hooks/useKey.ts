import { useInput } from './useInput'
import { checkSuperKey, SuperKey } from './useSelection'

export const useKey = (
  key: SuperKey | SuperKey[],
  handler: (input: string) => void,
  focused = false,
) => {
  return useInput((input) => {
    console.log(input)
    if (checkSuperKey(input, key)) {
      handler(input.raw)
    }
  }, focused)
}
