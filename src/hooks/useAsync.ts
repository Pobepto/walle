import { DependencyList, useEffect, useState } from 'react'

interface PromiseResult<T> {
  result?: T
  error?: Error
  isLoading: boolean
}

export const useAsync = <T>(call: () => Promise<T>, deps?: DependencyList) => {
  const [state, setState] = useState<PromiseResult<T>>({
    isLoading: true,
    result: null,
    error: null,
  })

  useEffect(() => {
    setState({ isLoading: true, result: null, error: null })

    call()
      .then((result) => setState({ isLoading: false, result, error: null }))
      .catch((error) => setState({ isLoading: false, result: null, error }))
  }, deps)

  return state
}
