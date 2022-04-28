import { GetState, SetState } from 'zustand'

export type Action<T extends object> = (
  set: SetState<T>,
  get: GetState<T>
) => (...args: unknown[]) => void

export * from './account'
export * from './app'
