import { useMemo, useState } from 'react'
import { Undefinable } from 'tsdef'

type Values = Record<string, Undefinable<string>>
type Rule<T> = (value: T[keyof T], data: Partial<T>) => string
type Rules<T> = Record<keyof T, Rule<T>>

interface InputProps {
  onBlur: () => void;
  onFocus: () => void;
  onChange: (e: string) => void;
  value: string;
}

type ValidateAction = 'blur' | 'focus' | 'change';

interface FormOptions {
  validateAction?: ValidateAction | 'never';
}

interface FormArgs<T> {
  initialValues?: Partial<T>;
  rules?: Partial<Rules<T>>;
  options?: FormOptions;
}

const defaultOptions: FormOptions = {
  validateAction: 'blur'
}

export const useForm = <T extends Values = Values>(
  { initialValues = {}, rules = {}, options = defaultOptions }: FormArgs<T> = {}
) => {
  const { validateAction } = options

  const [data, setData] = useState<Partial<T>>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const isValid = useMemo(
    () => !Object.values(errors).some(err => err.length),
    [errors]
  )

  const validateAll = () => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    Object.entries(rules).forEach(([key, rule]: [keyof T, Rule<T>]) => {
      const error = rule(data[key], data) || ''
      newErrors[key] = error
    })

    setErrors(newErrors)

    return [!Object.values(newErrors).some(err => err.length), newErrors]
  }

  const validateInput = (name: keyof T) => {
    const rule = rules[name]
    if (rule) {
      const error = rule(data[name], data) || ''
      setErrors(state => ({ ...state, [name]: error }))
    }
  }

  const validateInputOnAction = (name: keyof T, action: ValidateAction) => {
    if (validateAction === action) {
      validateInput(name)
    }
  }

  const onChange = (value: string, name: keyof T) => {
    setData(state => ({ ...state, [name]: value }))
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
      setData(state => ({ ...state, [name]: '' }))
    }

    return {
      onBlur: () => onBlur(name),
      onFocus: () => onFocus(name),
      onChange: (e: string) => onChange(e, name),
      value: data[name] ?? ''
    }
  }

  return { register, validateAll, data, errors, isValid }
}

export const combineRules = <T>(...rules: Rule<T>[]) => (value: T[keyof T], data: Partial<T>) => {
  return rules.reduce((err, rule) => {
    return err || rule(value, data)
  }, '')
}

export const lengthRule = (min: number, max = Infinity) => (value: string) => {
  if (value.length < min) {
    return `Must be at least ${min} characters`
  }

  if (value.length > max) {
    return `Must be at most ${max} characters`
  }
}
