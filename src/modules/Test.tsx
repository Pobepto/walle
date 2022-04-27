import React from 'react'
import { Text, useInput } from 'ink'
import { useNavigate } from '../Router'

export const Test: React.FC = () => {
  const navigate = useNavigate()

  useInput((input, key) => {
    if (key.upArrow) {
      navigate('ticker')
    }
  })

  return <Text>1</Text>
}
