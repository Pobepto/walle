import { DependencyList, useEffect, useState } from 'react'

interface PromiseResult<T> {
  result?: T
  error?: Error
  isLoading: boolean
}

export const useAsync = <T>(call: () => Promise<T>, deps?: DependencyList) => {
  const [state, setState] = useState<PromiseResult<T>>({
    isLoading: true,
    result: undefined,
    error: undefined,
  })

  useEffect(() => {
    setState({ isLoading: true, result: undefined, error: undefined })

    call()
      .then((result) =>
        setState({ isLoading: false, result, error: undefined }),
      )
      .catch((error) =>
        setState({ isLoading: false, result: undefined, error }),
      )
  }, deps)

  return state
}
