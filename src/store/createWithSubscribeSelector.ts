import create, { State, StateCreator } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export const createWithSubscribeSelector = <TState extends State>(
  createState: StateCreator<TState>,
) => {
  return create(subscribeWithSelector(createState))
}
