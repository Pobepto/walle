import { Box } from 'ink'
import React, { useEffect } from 'react'
import { useAutoSave } from './hooks/useAutoSave'
import { ROUTE, useNavigate, useRoute } from './routes'
import { useWalletConnectStore } from './store'
import { subscribe } from './store/subscribers'

// 🤔
subscribe()

export const App: React.FC = () => {
  // Temporary disable auto save
  // useAutoSave()
  const route = useRoute()
  const navigate = useNavigate()
  const pendingRequests = useWalletConnectStore((store) => store.requests)

  useEffect(() => {
    const lastRequest = pendingRequests.at(-1)

    if (lastRequest) {
      // console.log('lastRequest', lastRequest)
      // TODO: navigate
    }
  }, [pendingRequests.length])

  return (
    <Box width="95%" alignSelf="center" justifyContent="center">
      {route}
    </Box>
  )
}
