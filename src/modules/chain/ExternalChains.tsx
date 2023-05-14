import React, { useEffect, useMemo, useState } from 'react'
import { Box, Text } from 'ink'
import fetch from 'node-fetch'

import { ButtonProps } from '@components/Button'
import { TextButton, TextButtonProps } from '@components/TextButton'
import { Error } from '@src/components'
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
import { COLUMNS, ExternalChain } from '@src/constants'
import { useInput, useSelection } from '@src/hooks'
import { useAsync } from '@src/hooks/useAsync'
import { ROUTE, useNavigate } from '@src/routes'

enum FocusZones {
  CHAINS_LIST = 'CHAINS_LIST',
}

export const ExternalChains: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()
  const { selection, select, isActive, setAmount } = useSelection({
    prevKey: 'upArrow',
    nextKey: 'downArrow',
    isActive: parentZone.selection === COLUMNS.MAIN,
  })
  const [search, setSearch] = useState('')
  const [focusZone, setFocusZone] = useState<FocusZoneInfo>()
  const [externalChains, setExternalChains] = useState<ExternalChain[]>([])

  const handleSelectChain = (chain: ExternalChain) => {
    navigate(ROUTE.ADD_CHAIN, {
      chain: {
        chainId: chain.chainId,
        name: chain.name,
        currency: chain.nativeCurrency.symbol,
        explorer: chain.explorers && chain.explorers[0]?.url,
        rpc: chain.rpc[0],
      },
    })
  }

  const foundChains = useMemo(() => {
    if (!search) {
      return externalChains
    }
    const searchByChainId = !isNaN(+search)

    return externalChains.filter((chain) => {
      if (searchByChainId) {
        return chain.chainId.toString().includes(search)
      }

      return chain.name.toLowerCase().includes(search.toLowerCase())
    })
  }, [search, externalChains])

  const {
    execute: loadChains,
    isLoading,
    error,
  } = useAsync(async () => {
    const response = await fetch('https://chainid.network/chains.json')
    const result = (await response.json()) as ExternalChain[]
    return result.filter(
      (chain) => chain.rpc.length > 0 && chain.nativeCurrency.decimals === 18,
    )
  })

  useEffect(() => {
    loadChains()
      .then(setExternalChains)
      .catch(() => null)
  }, [])

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
          <Text bold> Select chain from https://chainid.network </Text>
        </Box>
        <Selection<InputBoxProps> activeProps={{ focus: true }}>
          <InputBox label="Search" value={search} onChange={setSearch} />
        </Selection>
        {error ? (
          <Error text={error} />
        ) : (
          <FocusZone id={FocusZones.CHAINS_LIST}>
            <List viewport={5} selection={selection - 1} isLoading={isLoading}>
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
        )}
        <Selection<ButtonProps> activeProps={{ isFocused: true }}>
          <ButtonLink to={ROUTE.SWITCH_CHAIN}>
            <Text>{'<- '}Back</Text>
          </ButtonLink>
        </Selection>
      </Box>
    </UncontrolledSelectionZone>
  )
}
