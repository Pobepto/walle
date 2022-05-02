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

  const onChange = (e: string, name: keyof T) => {
    setData(state => ({ ...state, [name]: '' }))
  }

  const onBlur = (name: keyof T) => {
    console.log('blur ', name)
  }

  const onFocus = (name: keyof T) => {
    console.log('focus ', name)
  }

  // TODO: fix initialValue type
  const register = (name: keyof T, initialValue: any = ''): InputProps => {
    const fieldProps: Omit<InputProps, 'value'> = {
      onBlur: () => onBlur(name),
      onFocus: () => onFocus(name),
      onChange: (e: string) => onChange(e, name)
    }

    if (name in data) {
      return { ...fieldProps, value: data[name] }
    } else {
      console.log('registering ', name)
      setData(state => ({ ...state, [name]: initialValue }))
      return { ...fieldProps, value: initialValue }
    }
  }

  return { register, data }
}
