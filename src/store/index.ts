import { GetState, SetState } from 'zustand'

export type Action<T extends object> = (
  set: SetState<T>,
  get: GetState<T>,
) => (...args: any[]) => any

export * from './wallet'
export * from './app'
