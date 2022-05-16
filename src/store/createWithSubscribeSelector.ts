import { subscribeWithSelector } from 'zustand/middleware'
import create, {
  Mutate,
  GetState,
  SetState,
  StoreApi,
  StateCreator,
  State,
} from 'zustand'

export const createWithSubscribeSelector = <TState extends State>(
  createState: StateCreator<TState>,
) => {
  return create<
    TState,
    SetState<TState>,
    GetState<TState>,
    Mutate<StoreApi<TState>, [['zustand/subscribeWithSelector', never]]>
  >(subscribeWithSelector(createState))
}
