import { useMemo, useState } from 'react'
import { Undefinable } from 'tsdef'

type Values = Record<string, Undefinable<string>>
type Rules<T> = Record<keyof T, (value: string) => string>

interface InputProps {
  onBlur: () => void;
  onFocus: () => void;
  onChange: (e: string) => void;
  value: string;
}

interface FormArgs<T> {
  initialValues?: Partial<T>;
  rules?: Partial<Rules<T>>;
}

export const useForm = <T extends Values = Values>(
  { initialValues = {}, rules = {} }: FormArgs<T> = {}
) => {
  const [data, setData] = useState<Partial<T>>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const isValid = useMemo(
    () => !Object.values(errors).some(err => err.length),
    [errors]
  )

  const validate = (name: keyof T) => {
    const rule = rules[name]
    if (rule) {
      setErrors(state => ({ ...state, [name]: rule(data[name]) }))
    }
  }

  const onChange = (value: string, name: keyof T) => {
    setData(state => ({ ...state, [name]: value }))
  }

  const onBlur = (name: keyof T) => {
    validate(name)
  }

  const onFocus = (name: keyof T) => {
    //
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

  return { register, data, errors, isValid }
}

export const lengthRule = (min: number, max: number) => (value: string) => {
  if (value.length < min) {
    return `Must be at least ${min} characters`
  }

  if (value.length > max) {
    return `Must be at most ${max} characters`
  }

  return ''
}
