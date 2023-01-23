import React, { useMemo, useState } from 'react'
import { Box, Text } from 'ink'

import { Button } from '@components/Button'
import { TextButton, TextButtonProps } from '@components/TextButton'
import { ButtonLink } from '@src/components/ButtonLink'
import { InputBox, InputBoxProps } from '@src/components/InputBox'
import { List } from '@src/components/List'
import {
  FocusZone,
  FocusZoneInfo,
  Selection,
  UncontrolledSelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { Chain } from '@src/constants'
import { useInput, useSelection } from '@src/hooks'
import { ROUTE, useNavigate } from '@src/routes'
import { COLUMNS } from '@store'
import { useBlockchainStore } from '@store/blockchain'

enum FocusZones {
  CHAINS_LIST = 'CHAINS_LIST',
}

export const SwitchChain: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()
  const { selection, select, isActive, setAmount } = useSelection({
    prevKey: 'upArrow',
    nextKey: 'downArrow',
    isActive: parentZone.selection === COLUMNS.MAIN,
  })
  const [search, setSearch] = useState('')
  const [focusZone, setFocusZone] = useState<FocusZoneInfo>()
  const chains = useBlockchainStore((store) => store.chains)
  const setChainId = useBlockchainStore((store) => store.setChainId)

  const handleSelectChain = (chain: Chain) => {
    setChainId(chain.chainId)
  }

  const foundChains = useMemo(() => {
    if (!search) {
      return chains
    }
    const searchByChainId = !isNaN(+search)

    return chains.filter((chain) => {
      if (searchByChainId) {
        return chain.chainId.toString().includes(search)
      }

      return chain.name.toLowerCase().includes(search.toLowerCase())
    })
  }, [search, chains])

  useInput(({ key, raw }) => {
    if (key.leftArrow) {
      return select(focusZone!.from)
    } else if (key.rightArrow) {
      return select(focusZone!.to)
    } else if (key.backspace || key.delete) {
      setSearch((s) => s.slice(0, -1))
      return select(focusZone!.from)
    }

    if (key.upArrow || key.downArrow || key.return || key.meta) {
      return
    }

    setSearch((s) => s + raw)
    select(focusZone!.from)
  }, focusZone?.id === FocusZones.CHAINS_LIST)

  return (
    <UncontrolledSelectionZone
      selection={selection}
      select={select}
      isActive={isActive}
      onChangeAmount={setAmount}
      onChangeFocusZone={setFocusZone}
    >
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text> Select chain or add custom </Text>
        </Box>
        <Selection<InputBoxProps> activeProps={{ focus: true }}>
          <InputBox label="Search" value={search} onChange={setSearch} />
        </Selection>
        <FocusZone id={FocusZones.CHAINS_LIST}>
          <List viewport={5} selection={selection - 2}>
            {foundChains.map((chain) => (
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
          <Button onPress={() => navigate(ROUTE.ADD_CHAIN, {})}>
            Add chain
          </Button>
        </Selection>
        <Selection activeProps={{ isFocused: true }}>
          <ButtonLink to={ROUTE.EXTERNAL_CHAINS}>
            Add chain from external source
          </ButtonLink>
        </Selection>
      </Box>
    </UncontrolledSelectionZone>
  )
}
