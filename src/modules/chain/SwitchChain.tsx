import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Text } from 'ink'
import { Undefinable } from 'tsdef'

import { Button } from '@components/Button'
import { TextButton } from '@components/TextButton'
import { ButtonLink } from '@src/components/ButtonLink'
import { Divider } from '@src/components/Divider'
import { InputBox, InputBoxProps } from '@src/components/InputBox'
import { List } from '@src/components/List'
import {
  FocusZone,
  FocusZoneInfo,
  Selection,
  SelectionZone,
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

interface ChainItemProps {
  chain: Chain
  isFocused?: boolean
  onActivate: (isActive: boolean) => void
  onSwitch: (chain: Chain) => void
  onEdit: (chain: Chain) => void
  onDelete: (chain: Chain) => void
}

const ChainItem: React.FC<ChainItemProps> = ({
  chain,
  isFocused = false,
  onActivate,
  onSwitch,
  onEdit,
  onDelete,
}) => {
  const chainId = useBlockchainStore((store) => store.chainId)
  const chains = useBlockchainStore((store) => store.chains)
  const [isActive, setActive] = useState(false)

  const currentChain = chains.find((chain) => chain.chainId === chainId)!

  useEffect(() => {
    if (!isFocused) {
      setActive(false)
    }
  }, [isFocused])

  useEffect(() => {
    onActivate(isActive)
  }, [isActive])

  return (
    <Box justifyContent="space-between">
      <TextButton isFocused={isFocused} onPress={() => setActive((v) => !v)}>
        {isFocused ? '->' : '-'} {chain.name} [{chain.chainId}]
      </TextButton>
      {isActive && (
        <Box paddingRight={1}>
          <SelectionZone isActive prevKey="leftArrow" nextKey="rightArrow">
            {currentChain.chainId !== chain.chainId && (
              <Selection>
                {(isFocused) => (
                  <TextButton
                    isFocused={isFocused}
                    onPress={() => onSwitch(chain)}
                  >
                    {isFocused ? '->' : ''}Switch
                  </TextButton>
                )}
              </Selection>
            )}
            <Text> </Text>
            <Selection>
              {(isFocused) => (
                <TextButton isFocused={isFocused} onPress={() => onEdit(chain)}>
                  {isFocused ? '->' : ''}Edit
                </TextButton>
              )}
            </Selection>
            <Text> </Text>
            {chains.length > 1 && (
              <Selection>
                {(isFocused) => (
                  <TextButton
                    isFocused={isFocused}
                    onPress={() => onDelete(chain)}
                  >
                    {isFocused ? '->' : ''}Delete
                  </TextButton>
                )}
              </Selection>
            )}
          </SelectionZone>
        </Box>
      )}
    </Box>
  )
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
  const chainIsActive = useRef(false)
  const focusZone = useRef<Undefinable<FocusZoneInfo>>(undefined)
  const chains = useBlockchainStore((store) => store.chains)
  const setChainId = useBlockchainStore((store) => store.setChainId)
  const deleteChain = useBlockchainStore((store) => store.deleteChain)

  const handleSwitchChain = (chain: Chain) => {
    setChainId(chain.chainId)
  }
  const handleEditChain = (chain: Chain) => {
    navigate(ROUTE.ADD_CHAIN, { chain, edit: true })
  }
  const handleDeleteChain = (chain: Chain) => {
    deleteChain(chain.chainId)
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
    const zone = focusZone.current

    if (!zone || chainIsActive.current || zone.id !== FocusZones.CHAINS_LIST)
      return

    if (key.leftArrow) {
      return select(zone.from)
    } else if (key.rightArrow) {
      return select(zone.to)
    } else if (key.backspace || key.delete) {
      setSearch((s) => s.slice(0, -1))
      return select(zone.from)
    }

    if (key.upArrow || key.downArrow || key.return || key.meta) {
      return
    }

    setSearch((s) => s + raw)
    select(zone.from)
  })

  return (
    <UncontrolledSelectionZone
      selection={selection}
      select={select}
      isActive={isActive}
      onChangeAmount={setAmount}
      onChangeFocusZone={(zone) => {
        focusZone.current = zone
      }}
    >
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text bold> Manage chains </Text>
        </Box>
        <Selection<InputBoxProps> activeProps={{ focus: true }}>
          <InputBox label="Search" value={search} onChange={setSearch} />
        </Selection>
        <FocusZone id={FocusZones.CHAINS_LIST}>
          <List viewport={5} selection={selection - 2}>
            {foundChains.map((chain) => (
              <Selection<ChainItemProps>
                key={chain.chainId}
                activeProps={{ isFocused: true }}
              >
                <ChainItem
                  chain={chain}
                  onActivate={(isActive) => {
                    chainIsActive.current = isActive
                  }}
                  onSwitch={handleSwitchChain}
                  onEdit={handleEditChain}
                  onDelete={handleDeleteChain}
                />
              </Selection>
            ))}
          </List>
        </FocusZone>
        <Divider symbol="—" />
        <Selection activeProps={{ isFocused: true }}>
          <Button onPress={() => navigate(ROUTE.ADD_CHAIN, {})}>
            Add chain
          </Button>
        </Selection>
        <Selection activeProps={{ isFocused: true }}>
          <ButtonLink to={ROUTE.EXTERNAL_CHAINS}>
            External chain list
          </ButtonLink>
        </Selection>
      </Box>
    </UncontrolledSelectionZone>
  )
}
