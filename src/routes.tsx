import { Test, Ticker } from './modules'
import { Routes } from './Router'

export const ROUTE = {
  TICKER: 'ticker',
  TEST: 'test'
}

export const routes: Routes = {
  [ROUTE.TICKER]: () => <Ticker />,
  [ROUTE.TEST]: () => <Test />
}
