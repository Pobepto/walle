import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { parseUnits } from '@ethersproject/units'
import { Rule } from './useForm'

export const length =
  <T>(min: number, max = Infinity): Rule<T> =>
  (value) => {
    if (value.length < min) {
      return `Must be at least ${min} characters`
    }

    if (value.length > max) {
      return `Must be at most ${max} characters`
    }
  }

export const isIntegerNumber =
  <T>(): Rule<T> =>
  (value) => {
    return Number.isInteger(parseFloat(value))
      ? undefined
      : 'Must be an integer'
  }

export const isNumber =
  <T>(): Rule<T> =>
  (value) => {
    return Number.isFinite(parseFloat(value)) ? undefined : 'Must be a number'
  }

export const numberInRange =
  <T>(min: number, max: number): Rule<T> =>
  (value) => {
    const number = Number(value)

    if (number < min) {
      return `Must be bigger than ${min}`
    }

    if (number > max) {
      return `Must be lest than ${max}`
    }
  }

export const bigNumberInRange =
  <T>(min: BigNumber, max: BigNumber, decimals: number): Rule<T> =>
  (value) => {
    const number = parseUnits(value, decimals)

    if (number.lt(min)) {
      return `Must be bigger than ${min}`
    }

    if (number.gt(max)) {
      return `Must be lest than ${max}`
    }
  }

export const isAddress =
  <T>(): Rule<T> =>
  (value) => {
    try {
      getAddress(value)
    } catch (error) {
      return `Address is invalid`
    }
  }

export const link =
  <T>(): Rule<T> =>
  (value) => {
    if (!value.startsWith('http')) {
      return `Must be a url`
    }
  }
