import React, { useEffect, useState } from 'react'
import { Box, Text } from 'ink'
import { useBlockchainStore } from '@store/blockchain'
import { Chain } from '@store/blockchain/constants'
import { TextButton } from '@components/TextButton'
import { Button } from '@components/Button'
import { ROUTE, useNavigate } from '@src/routes'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { COLUMNS } from '@store'
import fetch from 'node-fetch'
import { List } from '@src/components/List'
import { InputBox } from '@src/components/InputBox'

export const ExternalChains: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selection, setSelection] = useState(0)
  const [externalChains, setExternalChains] = useState<any[]>([])
  const setChainId = useBlockchainStore((store) => store.setChainId)

  const handleSelectChain = (chain: Chain) => {
    setChainId(chain.chainId)
  }

  useEffect(() => {
    const load = async () => {
      const response = await fetch('https://chainid.network/chains.json')
      const result = (await response.json()) as any[]

      setExternalChains(result)
    }

    load()
  }, [])

  return (
    <SelectionZone
      prevKey="upArrow"
      nextKey="downArrow"
      isActive={parentZone.selection === COLUMNS.MAIN}
      onChange={setSelection}
    >
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text> Switch chain </Text>
        </Box>
        <Text>Select chain from external source</Text>
        <Selection activeProps={{ focus: true }}>
          <InputBox label="Search" value={search} onChange={setSearch} />
        </Selection>
        <List selection={selection - 1 < 0 ? 0 : selection - 1}>
          {externalChains
            .filter((chain) =>
              chain.name.toLowerCase().includes(search.toLowerCase()),
            )
            .map((chain) => (
              <Box key={chain.chainId}>
                <Selection activeProps={{ isFocused: true }}>
                  <TextButton onPress={() => handleSelectChain(chain)}>
                    - {chain.name}
                  </TextButton>
                </Selection>
              </Box>
            ))}
        </List>
        <Selection activeProps={{ isFocused: true }}>
          <Button onPress={() => navigate(ROUTE.SWITCH_CHAIN)}>
            <Text>{'<- '}Back</Text>
          </Button>
        </Selection>
      </Box>
    </SelectionZone>
  )
}
