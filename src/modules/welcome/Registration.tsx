import { Box, Key, Text } from 'ink'

import React, { useState } from 'react'
import { Button } from '../../components/Button'
import { useInput } from '../../hooks/useInput'
import { ROUTE, useNavigate } from '../../routes'

export const Registration: React.FC = () => {
  const navigate = useNavigate()
  const currentIndex = useMove(2, 'leftArrow', 'rightArrow')

  return (
    <Box flexDirection="column">
      <Text>First time?</Text>
      <Text>Use {'<'}- or -{'>'} arrows to choose action</Text>
      <Box>
        <Button
          keyType="return"
          isFocused={currentIndex === 0}
          onPress={() => navigate(ROUTE.REGISTRATION_IMPORT)}
        >
          Import wallet
        </Button>
        <Button
          keyType="return"
          isFocused={currentIndex === 1}
          onPress={() => navigate(ROUTE.REGISTRATION_CREATE)}
        >
          Create wallet
        </Button>
      </Box>
    </Box>
  )
}

const useMove = (amount: number, prevKey: keyof Key, nextKey: keyof Key) => {
  const [currentIndex, setIndex] = useState(0)

  useInput((key) => {
    if (key[prevKey]) {
      setIndex(i => i === 0 ? amount - 1 : i - 1)
    } else if (key[nextKey]) {
      setIndex(i => i === amount - 1 ? 0 : i + 1)
    }
  })

  return currentIndex
}
