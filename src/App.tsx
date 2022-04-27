import React, { useEffect } from 'react'
import { useLocation, useRoute } from './Router'
import { Ticker } from './modules/Ticker'
import { Test } from './modules/Test'
import { Box, Text, Spacer } from 'ink'
import { useStore } from './store'

const routes = {
  ticker: () => <Ticker />,
  test: () => <Test />
}

export const App: React.FC = () => {
  const route = useRoute(routes)
  const location = useLocation()

  const test = useStore(store => store.test)
  const testFnc = useStore(store => store.testFnc)

  useEffect(() => {
    setInterval(() => {
      testFnc()
    }, 1000)
  }, [])

  return (
    <Box borderStyle="classic">
      <Spacer/>
      <Text>
        {location}
      </Text>
      <Text>{test}</Text>
      <Box>
        {route}
      </Box>
    </Box>
  )
}
