import { useEffect, useRef, useState } from 'react'

import { useInput } from './useInput'

// NOTE: A library like clipboardy/copy-paste does not work,
//       don't try or you will waste your time
export const useClipboard = (callback: (buffer: string) => void) => {
  const [buffer, setBuffer] = useState('')
  const timeout = useRef<NodeJS.Timeout>()

  useInput(({ raw }) => {
    if (raw.length > 2) {
      setBuffer((state) => state + raw)
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
