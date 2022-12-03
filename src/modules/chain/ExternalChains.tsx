import React, { useEffect, useMemo, useState } from 'react'
import { Box, Text } from 'ink'
import { useBlockchainStore } from '@store/blockchain'
import { TextButton, TextButtonProps } from '@components/TextButton'
import { Button } from '@components/Button'
import { ROUTE, useNavigate } from '@src/routes'
import {
  FocusZone,
  FocusZoneInfo,
  Selection,
  UncontrolledSelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { COLUMNS } from '@store'
import fetch from 'node-fetch'
import { List } from '@src/components/List'
import { InputBox } from '@src/components/InputBox'
import { useInput, useSelection } from '@src/hooks'

interface ExternalChain {
  chainId: number
  name: string
}

enum FocusZones {
  CHAINS_LIST = 'CHAINS_LIST',
}

export const ExternalChains: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()
  const [amount, setAmount] = useState(1)
  const [selection, select] = useSelection({
    amount,
    prevKey: 'upArrow',
    nextKey: 'downArrow',
    isActive: parentZone.selection === COLUMNS.MAIN,
    looped: true,
  })
  const [search, setSearch] = useState('')
  const [focusZone, setFocusZone] = useState<FocusZoneInfo>()
  const [externalChains, setExternalChains] = useState<ExternalChain[]>([])
  const setChainId = useBlockchainStore((store) => store.setChainId)

  const handleSelectChain = (chain: ExternalChain) => {
    setChainId(chain.chainId)
  }

  const filteredChains = useMemo(() => {
    return externalChains.filter((chain) =>
      chain.name.toLowerCase().includes(search.toLowerCase()),
    )
  }, [search, externalChains])

  useEffect(() => {
    const load = async () => {
      const response = await fetch('https://chainid.network/chains.json')
      const result = (await response.json()) as ExternalChain[]

      setExternalChains(result)
    }

    load()
  }, [])

  useInput(({ key, raw }) => {
    if (key.upArrow || key.downArrow) {
      return
    }

    if (key.leftArrow) {
      select(focusZone!.from)
    } else if (key.rightArrow) {
      select(focusZone!.to)
    } else if (key.backspace || key.delete) {
      setSearch((s) => s.slice(0, -1))
    } else {
      setSearch((s) => s + raw)
    }
  }, focusZone?.id === FocusZones.CHAINS_LIST)

  return (
    <UncontrolledSelectionZone
      selection={selection}
      select={select}
      isActive={parentZone.selection === COLUMNS.MAIN}
      onChangeAmount={setAmount}
      onChangeFocusZone={setFocusZone}
    >
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text> Switch chain </Text>
        </Box>
        <Text>Select chain from external source</Text>
        <Selection activeProps={{ focus: true }}>
          <InputBox label="Search" value={search} onChange={setSearch} />
        </Selection>
        <FocusZone id={FocusZones.CHAINS_LIST}>
          <List viewport={5} selection={selection - 1}>
            {filteredChains.map((chain) => (
              <Selection<TextButtonProps>
                key={chain.chainId}
                activeProps={{ isFocused: true }}
              >
                <TextButton onPress={() => handleSelectChain(chain)}>
                  - {chain.name} [{chain.chainId}]
                </TextButton>
              </Selection>
            ))}
          </List>
        </FocusZone>
        <Selection activeProps={{ isFocused: true }}>
          <Button onPress={() => navigate(ROUTE.SWITCH_CHAIN)}>
            <Text>{'<- '}Back</Text>
          </Button>
        </Selection>
      </Box>
    </UncontrolledSelectionZone>
  )
}
