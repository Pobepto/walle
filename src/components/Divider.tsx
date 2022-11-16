import { Box, DOMElement, Text } from 'ink'
import React, { useEffect, useRef, useState } from 'react'

export const Divider: React.FC<{ symbol?: string }> = ({ symbol = '-' }) => {
  const box = useRef<DOMElement>(null)
  const [value, setValue] = useState('')

  useEffect(() => {
    if (box.current) {
      const width = box.current.yogaNode!.getComputedWidth()

      setValue(symbol.repeat(width))
    }
  }, [box])

  return (
    <Box ref={box}>
      <Text>{value}</Text>
    </Box>
  )
}
