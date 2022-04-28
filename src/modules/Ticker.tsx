import React, { useEffect, useState } from 'react'
import { useInput, Text, Box } from 'ink'
import { useStore } from '../store'
import { ROUTE, useNavigate } from '../routes'

export const Ticker: React.FC = () => {
  const [counter, setCounter] = useState(0)
  const navigate = useNavigate()

  const test = useStore(store => store.test)
  const testFnc = useStore(store => store.testFnc)

  useEffect(() => {
    const timer = setInterval(() => {
      testFnc()
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useInput((input, key) => {
    if (key.downArrow) {
      navigate(ROUTE.TEST)
    }
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((previousCounter) => previousCounter + 1)
    }, 100)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return <Box>
    <Text color="green">{counter} tests passed</Text>
    <Text color="red">{test}</Text>
  </Box>
}
