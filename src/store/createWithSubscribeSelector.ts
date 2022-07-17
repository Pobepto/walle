import {
  subscribeWithSelector,
  persist,
  StateStorage,
} from 'zustand/middleware'
import create, {
  StateCreator,
  State,
  SetState,
  GetState,
  StoreApi,
  StoreMutatorIdentifier,
  PartialState,
} from 'zustand'
import { Storage } from '@utils'

type Middleware = <
  TState extends State,
  CustomSetState extends SetState<TState> = SetState<TState>,
  CustomGetState extends GetState<TState> = GetState<TState>,
  CustomStoreApi extends StoreApi<TState> = StoreApi<TState>,
>(
  config: (
    set: SetState<TState>,
    get: GetState<TState>,
    api: CustomStoreApi,
  ) => TState,
  fsName: string,
  keys: string[],
) => (set: CustomSetState, get: CustomGetState, api: CustomStoreApi) => TState

const fsStorage: Middleware = (config, fsName, keys) => (set, get, api) => {
  let isLoaded = false

  // нужно проверить и сохранить нужные данные в сто

  return config(
    async (partial, replace) => {
      const storage = await Storage.getInstance()
      console.log('isLoaded', isLoaded)
      console.log('fsName', fsName)

      if (isLoaded || fsName !== 'blockchain') {
        if (keys)
          await storage.add({
            key: fsName as any,
            data: partial as any,
          })
        await storage.save()
        set(partial, replace)
        return
      }

      console.log('Checking', partial)

      isLoaded = true
      const loaded = await storage.load(fsName as any)

      const store = {
        ...partial,
        ...loaded,
      }

      set(store, replace)
    },
    get,
    api,
  )
}

export const createWithSubscribeSelector = <TState extends State>(
  createState: StateCreator<TState>,
  fsName = 'any',
) => create(fsStorage(subscribeWithSelector(createState), fsName))
