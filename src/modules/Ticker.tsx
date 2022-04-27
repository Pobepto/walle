import React, { useEffect, useState } from 'react'
import { useInput, Text } from 'ink'
import { useNavigate } from '../Router'

export const Ticker: React.FC = () => {
  const [counter, setCounter] = useState(0)
  const navigate = useNavigate()

  useInput((input, key) => {
    if (key.downArrow) {
      navigate('test')
    }
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((previousCounter) => previousCounter + 1)
    }, 100)

    return () => {
      // console.log('leave from ticker')
      clearInterval(timer)
    }
  }, [])

  return <Text color="green">{counter} tests passed</Text>
}
