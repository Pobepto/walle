import create from 'zustand'
import { Action } from '..'

export interface AppStore {
  menuFocused: boolean,
  toggleMenu: () => void;
}

export type AppAction = Action<AppStore>

export const useAppStore = create<AppStore>((set) => ({
  menuFocused: true,
  toggleMenu: () => set((state) => ({ menuFocused: !state.menuFocused }))
}))
