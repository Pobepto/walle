import React, { useMemo, useRef, useState } from 'react'
import { Box, Text } from 'ink'
import { Undefinable } from 'tsdef'

import { Button } from '@components/Button'
import {
  ActionItem,
  ActionItemProps,
  ItemAction,
} from '@src/components/ActionItem'
import { ButtonLink } from '@src/components/ButtonLink'
import { Divider } from '@src/components/Divider'
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
  const actionModeIsActive = useRef(false)
  const focusZone = useRef<Undefinable<FocusZoneInfo>>(undefined)
  const chains = useBlockchainStore((store) => store.chains)
  const currentChainId = useBlockchainStore((store) => store.chainId)
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

  const getChainActions = (chain: Chain): ItemAction[] => {
    return [
      {
        label: 'Switch',
        isVisible: currentChainId !== chain.chainId,
        onAction: () => handleSwitchChain(chain),
      },
      {
        label: 'Edit',
        isVisible: true,
        onAction: () => handleEditChain(chain),
      },
      {
        label: 'Delete',
        isVisible: chains.length > 1,
        onAction: () => handleDeleteChain(chain),
      },
    ]
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

    if (
      !zone ||
      actionModeIsActive.current ||
      zone.id !== FocusZones.CHAINS_LIST
    )
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
            {foundChains.map((chain) => {
              return (
                <Selection<ActionItemProps>
                  key={chain.chainId}
                  activeProps={{ isFocused: true }}
                >
                  <ActionItem
                    label={`${chain.name} [${chain.chainId}]`}
                    onActionModeChange={(isActive) => {
                      actionModeIsActive.current = isActive
                    }}
                    actions={getChainActions(chain)}
                  />
                </Selection>
              )
            })}
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
