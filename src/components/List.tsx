import React from 'react'
import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'

interface ListProps {
  children: React.ReactNode | React.ReactNode[]
  selection: number
  viewport: number
  upArrow?: string
  downArrow?: string
  isLoading?: boolean
}

export const List: React.FC<ListProps> = ({
  children: _children,
  selection,
  viewport,
  upArrow = '▲',
  downArrow = '▼',
  isLoading = false,
}) => {
  const children = React.Children.toArray(_children)
  const doubleViewport = viewport * 2
  const childrenLength = children.length - 1

  if (isLoading) {
    return (
      <Box justifyContent="center" alignItems="center" height={5}>
        <Spinner />
      </Box>
    )
  }

  return (
    <>
      {selection > viewport && (
        <Box justifyContent="center">
          <Text>{upArrow}</Text>
        </Box>
      )}
      {children.map((child, index) => {
        let isRender = false

        // middle sector
        if (index >= selection - viewport && index <= selection + viewport) {
          isRender = true
        }

        // top\bottom sectors
        if (selection < viewport && index <= doubleViewport) {
          isRender = true
        } else if (
          selection > childrenLength - viewport &&
          index >= childrenLength - doubleViewport
        ) {
          isRender = true
        }

        return isRender ? child : null
      })}
      {selection < childrenLength - viewport && (
        <Box justifyContent="center">
          <Text>{downArrow}</Text>
        </Box>
      )}
    </>
  )
}
