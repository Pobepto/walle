import create from 'zustand'
import { Action } from '..'

export enum COLUMNS {
  MENU,
  MAIN,
  TOKENS,
}

export interface AppStore {
  empty?: any
}

export type AppAction = Action<AppStore>

export const useAppStore = create<AppStore>((set) => ({
  // empty
}))
