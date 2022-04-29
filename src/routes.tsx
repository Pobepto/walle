import React from 'react'
import { Account, Welcome } from './modules'
import { routerFactory } from './Router'

export enum ROUTE {
  WELCOME,
  ACCOUNT
}

const router = routerFactory<ROUTE>({
  [ROUTE.WELCOME]: () => <Welcome />,
  [ROUTE.ACCOUNT]: () => <Account />
})

export const { Router, useLocation, useNavigate, useRoute } = router
