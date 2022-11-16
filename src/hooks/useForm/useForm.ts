import { isDefined } from '@src/utils'
import { useMemo, useState } from 'react'

type Value = string
type Values = Record<string, Value>
export type Rule<Inputs> = (
  value: Value,
  data: Partial<Inputs>,
) => string | undefined
type Rules<Inputs> = Record<keyof Inputs, Rule<Inputs>>
type Errors<Inputs> = Partial<Record<keyof Inputs, string>>

interface InputProps {
  onBlur: () => void
  onFocus: () => void
  onChange: (value: Value) => void
  value: Value
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
  const [errors, setErrors] = useState<Errors<T>>({})

  const getIsValid = (errors: Errors<T>) => {
    return !Object.values(errors)
      .filter(isDefined)
      .some((err) => err.length)
  }

  const isValid = useMemo(() => getIsValid(errors), [errors])

  const validate = () => {
    const newErrors: Errors<T> = {}
    Object.entries(rules)
      .map((r) => r as [keyof T, Rule<T>])
      .forEach(([key, rule]) => {
        newErrors[key] = rule(data[key], data) || ''
      })

    setErrors(newErrors)

    return [getIsValid(newErrors), newErrors] as const
  }

  const validateInput = (name: keyof T, newValue?: Value) => {
    const rule = rules[name]
    if (rule) {
      const error = rule(newValue ?? data[name], data) || ''
      if (error !== errors[name]) {
        setErrors((state) => ({ ...state, [name]: error }))
      }
    }
  }

  const validateInputOnAction = (
    name: keyof T,
    action: ValidateAction,
    newValue?: Value,
  ) => {
    if (validateAction === action) {
      validateInput(name, newValue)
    }
  }

  const onChange = (name: keyof T, value: Value, forceValidate = false) => {
    setData((state) => ({ ...state, [name]: value }))

    if (forceValidate) {
      if (data[name] !== value) {
        validateInput(name, value)
      }
    } else {
      validateInputOnAction(name, 'change', value)
    }
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
      onChange: (value: Value) => onChange(name, value),
      value: data[name] ?? '',
    }
  }

  return {
    register,
    validate,
    validateInput,
    data,
    errors,
    isValid,
    setData,
    change: onChange,
  }
}

export const combine =
  <T>(...rules: Rule<T>[]) =>
  (value: Value, data: Partial<T>) => {
    return rules.reduce((err, rule) => {
      return (err || rule(value, data)) as string
    }, '')
  }
