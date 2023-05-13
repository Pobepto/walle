import React, { useState } from 'react'
import { Box, Text } from 'ink'

import { Error } from '@src/components'
import { InputBox } from '@src/components/InputBox'
import { Loader } from '@src/components/Loader'
import { useSelectionZone } from '@src/components/SelectionZone'
import { useForm, useKey } from '@src/hooks'
import { ROUTE, useNavigate, useRouteData } from '@src/routes'
import { COLUMNS, useWalletStore } from '@src/store'

export const PasswordGuard: React.FC = () => {
  const parentZone = useSelectionZone()!
  const route = useRouteData<ROUTE.PASSWORD_GUARD>()
  const navigate = useNavigate()
  const decryptWallet = useWalletStore((store) => store.decryptWallet)
  const activeWallet = useWalletStore((store) => store.activeWallet)

  const [error, setError] = useState('')
  const [inProgress, setInProgress] = useState(false)
  const { data, register } = useForm({
    initialValues: {
      password: '',
    },
  })

  useKey(
    'return',
    async () => {
      if (!data.password || inProgress) return

      try {
        setInProgress(true)
        await decryptWallet(activeWallet!, data.password)
        navigate(route)
      } catch {
        setError('Invalid password')
      } finally {
        setInProgress(false)
      }
    },
    parentZone.selection === COLUMNS.MAIN,
  )

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text bold> Confirm password </Text>
      </Box>
      <Box width="90%" marginY={1}>
        <Text>Please confirm the password to access this feature</Text>
      </Box>
      <InputBox
        label="Password"
        mask="*"
        focus={parentZone.selection === COLUMNS.MAIN}
        {...register('password')}
      />
      <Box justifyContent="center">
        <Loader loading={inProgress}>
          <Error text={error} />
        </Loader>
      </Box>
    </Box>
  )
}
