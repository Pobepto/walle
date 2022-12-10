import { Key, useInput as useInputInk } from 'ink'
import { useRef } from 'react'

export type UserInput = { key: Key; raw: string }

export const useInput = (
  handler: (input: UserInput) => void,
  isActive = true,
) => {
  const prevented = useRef(false)

  useInputInk(
    (raw, key) => {
      if (prevented.current) {
        prevented.current = false
        return
      }

      handler({ key, raw })
    },
    { isActive },
  )

  const prevent = () => {
    prevented.current = true
  }

  return prevent
}
