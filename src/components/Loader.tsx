import React from 'react'
import Spinner from 'ink-spinner'
import type { SpinnerName } from 'cli-spinners'

interface Props {
  loading?: boolean
  type?: SpinnerName
  children: React.ReactNode | React.ReactNode[]
}

export const Loader: React.FC<Props> = ({ loading, type, children }) => {
  return loading ? <Spinner type={type} /> : <>{children}</>
}
