import React from 'react'
import { Box } from 'ink'

import { ROUTE, useRouteData } from '@src/routes'

export const StatusTransaction: React.FC = () => {
  const { receipt } = useRouteData<ROUTE.STATUS_TRANSACTION>()

  return <Box display="flex" flexDirection="column"></Box>
}
