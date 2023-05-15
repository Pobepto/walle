import React, { Fragment, useEffect, useState } from 'react'
import { Box, Text } from 'ink'

import { SuperKey } from '@src/hooks'

import { Selection, SelectionZone } from './SelectionZone'
import { TextButton } from './TextButton'

export interface ItemAction {
  label: string
  isVisible: boolean
  onAction: () => void
}

export interface ActionItemProps {
  label: string
  isFocused?: boolean
  onActionModeChange?: (isActive: boolean) => void
  actions: ItemAction[]
  openActionsKey?: SuperKey | SuperKey[]
  labelPrefix?: string
  labelFocusedPrefix?: string
}

export const ActionItem: React.FC<ActionItemProps> = ({
  label,
  isFocused = false,
  actions,
  openActionsKey = 'return',
  labelPrefix = '-',
  labelFocusedPrefix = '->',
  onActionModeChange,
}) => {
  const [actionsIsActive, setActionsActive] = useState(false)

  useEffect(() => {
    if (!isFocused) {
      setActionsActive(false)
    }
  }, [isFocused])

  useEffect(() => {
    onActionModeChange && onActionModeChange(actionsIsActive)
  }, [actionsIsActive])

  return (
    <Box justifyContent="space-between">
      <TextButton
        isFocused={isFocused}
        selectKey={openActionsKey}
        onPress={() => setActionsActive((v) => !v)}
      >
        {isFocused ? labelFocusedPrefix : labelPrefix} {label}
      </TextButton>
      {actionsIsActive && (
        <Box paddingRight={1}>
          <SelectionZone isActive prevKey="leftArrow" nextKey="rightArrow">
            {actions
              .filter((action) => action.isVisible)
              .map((action) => (
                <Fragment key={action.label}>
                  <Selection>
                    {(isFocused) => (
                      <TextButton
                        isFocused={isFocused}
                        onPress={action.onAction}
                      >
                        {isFocused ? '->' : ''}
                        {action.label}
                      </TextButton>
                    )}
                  </Selection>
                  <Text> </Text>
                </Fragment>
              ))}
          </SelectionZone>
        </Box>
      )}
    </Box>
  )
}
