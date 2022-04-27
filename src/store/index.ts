import create, { GetState, SetState } from 'zustand'
import { createAccountStore, AccountStore } from './account'
import { createTestStore, TestStore } from './test'

export type Store<T extends object, E extends object = T> = (
  set: SetState<E extends T ? E : E & T>,
  get: GetState<E extends T ? E : E & T>
) => T;

type RootStore = AccountStore & TestStore;

export const createRootStore = (set: SetState<any>, get: GetState<any>) => ({
  ...createAccountStore(set, get),
  ...createTestStore(set, get)
})

export const useStore = create<RootStore>(createRootStore)
