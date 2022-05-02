import React from 'react'
import { Box, Text } from 'ink'
import { Input } from '../../components'
import { useForm } from '../../hooks/useForm';

type Inputs = {
  password: string;
  repeatPassword: string;
}

export const SetPassword: React.FC = () => {
  const { register, data } = useForm<Inputs>();

  console.log(data)

  const a = register("password")

  console.log(a);

  return (
    <Box>
      <Text>Set password to protect your wallet</Text>
      <Box borderStyle="classic" flexDirection="column">
        <Text>New password: </Text>
        <Input {...register("password")} mask="*" />
      </Box>
      <Box borderStyle="classic" flexDirection="column">
        <Text>Confirm password: </Text>
        <Input {...register("repeatPassword")} mask="*" />
      </Box>
    </Box>
  )
}
