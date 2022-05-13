import { useEffect, useState } from 'react'
import { AnyFunction } from 'tsdef'

export const useLoading = <T, >(action: AnyFunction) => {
  const [data, setData] = useState<T>()
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  const callAction = async () => {
    setIsLoading(true)
    setHasError(false)
    try {
      const response = await action()
      setData(response)
    } catch (error) {
      setHasError(true)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    callAction()
  }, [setData])

  return { data, isLoading, hasError }
}
