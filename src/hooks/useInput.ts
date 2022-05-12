import { Key, useInput as useInputInk } from 'ink'
import { useRef } from 'react'

export const useInput = (
  handler: (key: Key, input: string) => void,
  focused = true
) => {
  const prevented = useRef(false)

  useInputInk((input, key) => {
    if (prevented.current) {
      prevented.current = false
      return
    }

    handler(key, input)
  }, { isActive: focused })

  const prevent = () => {
    prevented.current = true
  }

  return prevent
}
