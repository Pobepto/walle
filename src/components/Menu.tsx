import React, { useState } from 'react'
import { Text, Box, useInput } from 'ink'

interface Props {
  items: any[];
}

export const Menu: React.FC<Props> = ({ items }) => {
  const [selectedIndex, setIndex] = useState(0)

  useInput((input, key) => {
    if (key.upArrow) {
      setIndex(i => i === 0 ? items.length - 1 : i - 1)
    } else if (key.downArrow) {
      setIndex(i => i === items.length - 1 ? 0 : i + 1)
    }
  })

  return (
    <Box display='flex' flexDirection='column'>
      {items.map((item, index) => <Text
        bold={index === selectedIndex}
        key={index}>
          {item.title}
        </Text>
      )}
    </Box>
  )
}
