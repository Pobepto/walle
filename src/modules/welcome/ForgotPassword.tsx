import React from 'react'
import { Box, Text } from 'ink'

import { ROUTE, useNavigate } from '@routes'
import { Button } from '@src/components'
import { InputBox } from '@src/components/InputBox'
import { TextButton } from '@src/components/TextButton'
import { isEqualToString, useForm, useSelection } from '@src/hooks'
import { remove, USER_DATA } from '@src/utils'

type Inputs = {
  agreement: string
}

const REQUIRED_WORD = 'DELETE'

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate()
  const { errors, register, validate } = useForm<Inputs>({
    rules: {
      agreement: isEqualToString(REQUIRED_WORD),
    },
    options: {
      validateAction: 'never',
    },
  })

  const {
    selection,
    select,
    prevent: preventInput,
  } = useSelection({
    amount: 3,
    prevKey: 'upArrow',
    nextKey: ['downArrow', 'return'],
    isActive: true,
  })

  const onApply = () => {
    const [isValid] = validate()

    if (isValid) {
      remove(USER_DATA)
      navigate(ROUTE.WELCOME)
    } else {
      preventInput()
      select(0)
    }
  }

  return (
    <Box
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
    >
      <Box flexDirection="column" marginBottom={1}>
        <Text>
          Are you sure you want to <Text bold>DELETE</Text> your wallet?
        </Text>
      </Box>
      <Box flexDirection="column" width="75%" marginBottom={1}>
        <Text>
          Your current wallet, accounts and assets will be removed from your
          wallet. <Text bold>This action cannot be undone.</Text> You can only
          restore your wallet with a secret phrase.
        </Text>
      </Box>
      <Box flexDirection="column" width="50%" marginBottom={1}>
        <Text>
          Enter <Text bold>DELETE</Text> to delete the current wallet
        </Text>
      </Box>
      <Box flexDirection="column" width="50%">
        <InputBox
          label="Are you sure?"
          error={errors.agreement}
          focus={selection === 0}
          {...register('agreement')}
        />
        <Button
          isFocused={selection === 1}
          onPress={onApply}
          spinner="fingerDance"
          borderColor="red"
        >
          <Text color="red">DELETE MY ACCOUNT</Text>
        </Button>
        <Box alignItems="center" justifyContent="center">
          <TextButton
            isFocused={selection === 2}
            onPress={() => navigate(ROUTE.LOGIN)}
          >
            Back
          </TextButton>
        </Box>
      </Box>
    </Box>
  )
}
