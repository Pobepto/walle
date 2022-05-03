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
    console.log('blur ', name)
    validate(name)
  }

  const onFocus = (name: keyof T) => {
    console.log('focus ', name)
  }

  const register = (name: keyof T): InputProps => {
    const fieldProps: Omit<InputProps, 'value'> = {
      onBlur: () => onBlur(name),
      onFocus: () => onFocus(name),
      onChange: (e: string) => onChange(e, name)
    }

    if (name in data) {
      return { ...fieldProps, value: data[name] }
    }

    setData(state => ({ ...state, [name]: initialValues[name] ?? '' }))
    return { ...fieldProps, value: initialValues[name] ?? '' }
  }

  return { register, data, errors, isValid }
}
