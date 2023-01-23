import React from 'react'
import { Box, Text } from 'ink'

import { InputBox } from '@components/InputBox'
import { ButtonLink } from '@src/components/ButtonLink'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { useWallet } from '@src/hooks'
import { ROUTE } from '@src/routes'
import { COLUMNS } from '@store'

export const ShowSeedPhrase: React.FC = () => {
  const wallet = useWallet()!
  const parentZone = useSelectionZone()!

  // TODO: Figure out how to copy text to the clipboard
  // const onCopy = () => {
  //   console.log(wallet.mnemonic.path)
  // }

  return (
    <SelectionZone
      prevKey="upArrow"
      nextKey={['downArrow', 'return']}
      isActive={parentZone.selection === COLUMNS.MAIN}
    >
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text bold> Seed Phrase </Text>
        </Box>
        <InputBox
          onChange={() => undefined}
          value={wallet.mnemonic.phrase}
          disabled
        />
        <Box width="90%" marginTop={1} marginBottom={1}>
          <Text bold color="red">
            It is important to never share your seed phrase with anyone.
          </Text>
        </Box>
        <Box width="90%" marginBottom={1}>
          <Text>
            Your seed phrase is a unique and confidential code that is used to
            access your cryptocurrency wallet. If someone else has access to
            your seed phrase, they can potentially steal your funds or make
            unauthorized transactions on your behalf.
          </Text>
        </Box>
        {/* <Selection activeProps={{ isFocused: true }}>
          <Button onPress={onCopy}>Copy to buffer</Button>
        </Selection> */}
        <Selection activeProps={{ isFocused: true }}>
          <ButtonLink to={ROUTE.SECURITY}>Back</ButtonLink>
        </Selection>
      </Box>
    </SelectionZone>
  )
}
