import { GetState, SetState } from 'zustand'

export type Action<T extends object> = (
  set: SetState<T>,
  get: GetState<T>,
) => (...args: any[]) => Promise<void> | void

export * from './wallet'
export * from './app'
