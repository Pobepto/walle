import { useState } from 'react'

type FieldValues = Record<string, unknown>

interface InputProps {
  onBlur: () => void;
  onFocus: () => void;
  onChange: (e: string) => void;
  value: any;
}

export const useForm = <T extends FieldValues = FieldValues>(
  initialValues: Partial<T> = {}
) => {
  const [data, setData] = useState<Partial<T>>(initialValues)

  const onChange = (value: string, name: keyof T) => {
    setData(state => ({ ...state, [name]: value }))
  }

  const onBlur = (name: keyof T) => {
    console.log('blur ', name)
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

  return { register, data }
}
