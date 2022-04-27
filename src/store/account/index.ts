import { Store } from '..'

export interface AccountStore {
  something: string,
  ping: () => void;
}

export const createAccountStore: Store<AccountStore> = (set, get) => ({
  something: 'pi pi bo bo',
  ping: () => set(store => ({ something: store.something + ' co co co' }))
})
