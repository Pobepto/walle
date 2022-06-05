import { GetState, SetState } from 'zustand'

export type Action<TState extends object, TValue = (...args: any[]) => any> = (
  set: SetState<TState>,
  get: GetState<TState>,
) => TValue

export * from './wallet'
export * from './app'
export * from './blockchain'
export * from './tokens'
