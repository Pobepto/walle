import { getAddress } from '@ethersproject/address'

export const length =
  (min: number, max = Infinity) =>
  (value: string) => {
    if (value.length < min) {
      return `Must be at least ${min} characters`
    }

    if (value.length > max) {
      return `Must be at most ${max} characters`
    }
  }

export const isNumber = () => (value: string) => {
  return Number.isInteger(parseFloat(value)) ? undefined : 'Must be a number'
}

export const numberInRange = (min: number, max: number) => (value: string) => {
  const number = Number(value)

  if (number < min) {
    return `Must be bigger than ${min}`
  }

  if (number > max) {
    return `Must be lest than ${max}`
  }
}

export const isAddress = () => (value: string) => {
  try {
    getAddress(value)
  } catch (error) {
    return `Address is invalid`
  }
}

export const link = () => (value: string) => {
  if (!value.startsWith('http')) {
    return `Must be a url`
  }
}
