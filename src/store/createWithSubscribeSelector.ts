import { subscribeWithSelector } from 'zustand/middleware'
import create, { StateCreator, State } from 'zustand'

export const createWithSubscribeSelector = <TState extends State>(
  createState: StateCreator<TState>,
) => {
  return create(subscribeWithSelector(createState))
}
