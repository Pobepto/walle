import { createRef, useState } from "react"

type FieldValues = Record<string, any>

export const useForm = <T extends FieldValues = FieldValues>(
  // initialValues: T = {}
) => {
  const [data, setData] = useState<Record<keyof T, any>>()
  const onChange = (e: string, name: keyof T) =>
    setData(state => ({ ...state, [name]: ''}))
  const onBlur = (name: keyof T) => console.log('blur ', name)
  const register = (name: keyof T) => {
    const fieldProps = {
      onBlur: () => onBlur(name),
      onChange: (e: string) => onChange(e, name),
    }

    if (data && data[name]) {
      return { ...fieldProps, value: data[name] }
    } else {
      console.log('registering ', name)
      setData(state => ({ ...state, [name]: ''}))
      return { ...fieldProps, value: '' }
    }
  }
  return { register, data }
}