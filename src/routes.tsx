import React from 'react'
import { Account } from './modules'
import { Routes, routerFactory } from './Router'

export enum ROUTE {
  ACCOUNT
}

export const { Router, useLocation, useNavigate, useRoutes } = routerFactory<ROUTE>()

export const routes: Routes = {
  [ROUTE.ACCOUNT]: () => <Account />
}
