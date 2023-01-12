import { useState } from 'react'

export const useAsync = <Args extends any[], Return>(
  func: (...args: Args) => Promise<Return>,
) => {
  const [state, setState] = useState({
    isLoading: false,
    error: '',
  })

  const execute = async (...args: Args): Promise<Return> => {
    setState({ isLoading: true, error: '' })

    try {
      const result = await func(...args)
      setState({ isLoading: false, error: '' })
      return Promise.resolve(result)
    } catch (err) {
      setState({ isLoading: false, error: err?.toString() ?? 'Unknown error' })
      return Promise.reject(err)
    }
  }

  return {
    execute,
    ...state,
  }
}
