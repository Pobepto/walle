import React, { useState, useEffect } from 'react'
import { Text, useInput } from 'ink'

export const App: React.FC = () => {
  const [counter, setCounter] = useState(0)

  useInput((input, key) => {
    console.log(input, key)
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((previousCounter) => previousCounter + 1)
    }, 100)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return <Text color="green">{counter} tests passed</Text>
}
