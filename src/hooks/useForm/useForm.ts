import { isDefined } from '@src/utils'
import { useMemo, useState } from 'react'

type Value = string
type DefaultValues = Record<string, Value>
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

interface FormArgs<Values> {
  initialValues?: Partial<Values>
  rules?: Partial<Rules<Values>>
  options?: FormOptions
}

const defaultOptions: FormOptions = {
  validateAction: 'blur',
}

export const useForm = <Values extends DefaultValues = DefaultValues>({
  initialValues = {},
  rules = {},
  options = defaultOptions,
}: FormArgs<Values> = {}) => {
  const { validateAction } = options

  const [data, setData] = useState(initialValues as Values)
  const [errors, setErrors] = useState<Errors<Values>>({})

  const getIsValid = (errors: Errors<Values>) => {
    return !Object.values(errors)
      .filter(isDefined)
      .some((err) => err.length)
  }

  const isValid = useMemo(() => getIsValid(errors), [errors])

  const inputIsValid = (name: keyof Values) => {
    const rule = rules[name]
    return rule ? !rule(data[name], data) : true
  }

  const setInputError = (name: keyof Values, error?: string) => {
    setErrors({
      ...errors,
      [name]: error,
    })
  }

  const validate = () => {
    const newErrors: Errors<Values> = {}
    Object.entries(rules)
      .map((r) => r as [keyof Values, Rule<Values>])
      .forEach(([key, rule]) => {
        newErrors[key] = rule(data[key], data) || ''
      })

    setErrors(newErrors)

    return [getIsValid(newErrors), newErrors] as const
  }

  const validateInput = (name: keyof Values, newValue?: Value) => {
    const rule = rules[name]
    if (rule) {
      const error = rule(newValue ?? data[name], data) || ''
      if (error !== errors[name]) {
        setErrors((state) => ({ ...state, [name]: error }))
      }
    }
  }

  const validateInputOnAction = (
    name: keyof Values,
    action: ValidateAction,
    newValue?: Value,
  ) => {
    if (validateAction === action) {
      validateInput(name, newValue)
    }
  }

  const onChange = (
    name: keyof Values,
    value: Value,
    forceValidate = false,
  ) => {
    setData((state) => ({ ...state, [name]: value }))

    if (forceValidate) {
      if (data[name] !== value) {
        validateInput(name, value)
      }
    } else {
      validateInputOnAction(name, 'change', value)
    }
  }

  const onBlur = (name: keyof Values) => {
    validateInputOnAction(name, 'blur')
  }

  const onFocus = (name: keyof Values) => {
    validateInputOnAction(name, 'focus')
  }

  const register = (name: keyof Values): InputProps => {
    if (!(name in data)) {
      setData((state) => ({ ...state, [name]: '' }))
    }

    return {
      onBlur: () => onBlur(name),
      onFocus: () => onFocus(name),
      onChange: (value: Value) => onChange(name, value),
      value: data[name]?.toString() ?? '',
    }
  }

  return {
    register,
    validate,
    validateInput,
    inputIsValid,
    setInputError,
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
