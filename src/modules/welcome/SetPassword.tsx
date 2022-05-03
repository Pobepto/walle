import React from 'react'
import { Box, Text } from 'ink'
import { Input } from '../../components'
import { useForm } from '../../hooks/useForm'

type Inputs = {
  password: number;
  repeatPassword: string;
}

export const SetPassword: React.FC = () => {
  const { register } = useForm<Inputs>()

  return (
    <Box flexDirection="column">
      <Text>Set password to protect your wallet</Text>
      <Box borderStyle="classic" flexDirection="column">
        <Text>New password: </Text>
        <Input {...register('password')} mask="*" />
      </Box>
      <Box borderStyle="classic" flexDirection="column">
        <Text>Confirm password: </Text>
        <Input {...register('repeatPassword')} mask="*" />
      </Box>
    </Box>
  )
}
