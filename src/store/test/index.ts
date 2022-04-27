import { Store } from '..'

export interface TestStore {
  test: string,
  testFnc: () => void;
}

export const createTestStore: Store<TestStore> = (set, get) => ({
  test: 'din gon din',
  testFnc: () => set(store => ({ test: store.test + ' bip bip bip' }))
})
