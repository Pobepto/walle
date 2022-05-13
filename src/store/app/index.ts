import create from 'zustand'
import { Action } from '..'

export enum COLUMNS {
  MENU,
  MAIN,
  TOKENS
}

export interface AppStore {
  activeColumn: COLUMNS,
  setActiveColumn: (column: COLUMNS) => void;
}

export type AppAction = Action<AppStore>

export const useAppStore = create<AppStore>((set) => ({
  activeColumn: COLUMNS.MENU,
  setActiveColumn: (column: COLUMNS) => set({ activeColumn: column })
}))
