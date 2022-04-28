import { GetState, SetState } from 'zustand'

export * from './account'

export type Action<T extends object> = (
  set: SetState<T>,
  get: GetState<T>
) => (...args: unknown[]) => void
