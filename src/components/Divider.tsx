import React, { useEffect, useRef, useState } from 'react'
import { Box, DOMElement, Text } from 'ink'

export const Divider: React.FC<{ symbol?: string }> = ({ symbol = '-' }) => {
  const box = useRef<DOMElement>(null)
  const [value, setValue] = useState('')

  useEffect(() => {
    if (box.current) {
      const width = box.current.yogaNode!.getComputedWidth() - 1

      setValue(symbol.repeat(width))
    }
  }, [box])

  return (
    <Box ref={box} alignItems="center">
      <Text>{value}</Text>
    </Box>
  )
}
