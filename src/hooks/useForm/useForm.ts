import { isDefined } from '@src/utils'
import { useEffect, useMemo, useState } from 'react'

type Values = Record<string, string>
type Rule<T> = (value: T[keyof T], data: Partial<T>) => string | undefined
type Rules<T> = Record<keyof T, Rule<T>>

interface InputProps {
  onBlur: () => void
  onFocus: () => void
  onChange: (e: string) => void
  value: string
}

type ValidateAction = 'blur' | 'focus' | 'change'

interface FormOptions {
  validateAction?: ValidateAction | 'never'
}

interface FormArgs<T> {
  initialValues?: Partial<T>
  rules?: Partial<Rules<T>>
  options?: FormOptions
}

const defaultOptions: FormOptions = {
  validateAction: 'blur',
}

export const useForm = <T extends Values = Values>({
  initialValues = {},
  rules = {},
  options = defaultOptions,
}: FormArgs<T> = {}) => {
  const { validateAction } = options

  const [data, setData] = useState(initialValues as T)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})

  const getIsValid = (errors: Partial<Record<keyof T, string>>) => {
    return !Object.values(errors)
      .filter(isDefined)
      .some((err) => err.length)
  }

  const isValid = useMemo(() => getIsValid(errors), [errors])

  const validate = () => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    Object.entries(rules)
      .map((r) => r as [keyof T, Rule<T>])
      .forEach(([key, rule]) => {
        newErrors[key] = rule(data[key], data) || ''
      })

    setErrors(newErrors)

    return [getIsValid(newErrors), newErrors]
  }

  const validateInput = (name: keyof T) => {
    const rule = rules[name]
    if (rule) {
      const error = rule(data[name], data) || ''
      if (error !== errors[name]) {
        setErrors((state) => ({ ...state, [name]: error }))
      }
    }
  }

  const validateInputOnAction = (name: keyof T, action: ValidateAction) => {
    if (validateAction === action) {
      validateInput(name)
    }
  }

  const onChange = (name: keyof T, value: string) => {
    setData((state) => ({ ...state, [name]: value }))
    // TODO: fix this
    validateInputOnAction(name, 'change')
  }

  const onBlur = (name: keyof T) => {
    validateInputOnAction(name, 'blur')
  }

  const onFocus = (name: keyof T) => {
    validateInputOnAction(name, 'focus')
  }

  const register = (name: keyof T): InputProps => {
    if (!(name in data)) {
      setData((state) => ({ ...state, [name]: '' }))
    }

    return {
      onBlur: () => onBlur(name),
      onFocus: () => onFocus(name),
      onChange: (e: string) => onChange(name, e),
      value: data[name] ?? '',
    }
  }

  return {
    register,
    validate,
    data,
    errors,
    isValid,
    setData,
    change: onChange,
  }
}

export const combine =
  <T>(...rules: Rule<T>[]) =>
  (value: T[keyof T], data: Partial<T>) => {
    return rules.reduce((err, rule) => {
      return (err || rule(value, data)) as string
    }, '')
  }
