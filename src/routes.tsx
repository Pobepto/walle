import React from 'react'
import { Test, Ticker } from './modules'
import { Routes, routerFactory } from './Router'

export enum ROUTE {
  TICKER,
  TEST
}

export const { Router, useLocation, useNavigate, useRoutes } = routerFactory<ROUTE>()

export const routes: Routes = {
  [ROUTE.TICKER]: () => <Ticker />,
  [ROUTE.TEST]: () => <Test />
}
