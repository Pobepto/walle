import { useEffect, useRef, useState } from 'react'
import { AnyFunction } from 'tsdef'
import { useInput } from './useInput'

export const useClipboard = (callback: AnyFunction) => {
  const [buffer, setBuffer] = useState('')
  const timeout = useRef<NodeJS.Timeout>()

  useInput((key, input) => {
    if (input.length > 2) {
      setBuffer((state) => state + input)
    }
  })

  useEffect(() => {
    if (buffer.length) {
      process.nextTick(() => callback(buffer))
      clearTimeout(timeout.current)
      timeout.current = setTimeout(() => setBuffer(''), 500)
    }
  }, [buffer])
}
