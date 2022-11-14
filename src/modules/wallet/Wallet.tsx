import React from 'react'
import { Box, Text } from 'ink'
// import { List } from '@src/components/List'
// import { TextButton } from '@src/components/TextButton'

export const Wallet: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column">
      <Text>Hello World</Text>
      {/* Test */}
      {/* <List
        activeProps={{ isFocused: true }}
        prevKey="upArrow"
        nextKey="downArrow"
        isActive
      >
        <TextButton onPress={() => console.log('1')}>Item 1</TextButton>
        <TextButton onPress={() => console.log('2')}>Item 2</TextButton>
        <TextButton onPress={() => console.log('3')}>Item 3</TextButton>
        <TextButton onPress={() => console.log('4')}>Item 4</TextButton>
        <TextButton onPress={() => console.log('5')}>Item 5</TextButton>
        <TextButton onPress={() => console.log('6')}>Item 6</TextButton>
        <TextButton onPress={() => console.log('7')}>Item 7</TextButton>
      </List> */}
    </Box>
  )
}
