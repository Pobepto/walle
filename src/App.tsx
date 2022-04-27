import React from 'react'
import { useLocation, useRoute } from './Router'
import { Ticker } from './modules/Ticker'
import { Test } from './modules/Test'
import { Box, Text, Spacer } from 'ink'

const routes = {
  ticker: () => <Ticker />,
  test: () => <Test />
}

export const App: React.FC = () => {
  const route = useRoute(routes)
  const location = useLocation()

  return (
    <Box borderStyle="classic">
      <Spacer/>
      <Text>
        {location}
      </Text>
      <Box>
        {route}
      </Box>
    </Box>
  )
}
