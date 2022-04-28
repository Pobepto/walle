import React from 'react'
import { Account } from './modules'
import { routerFactory } from './Router'

export enum ROUTE {
  ACCOUNT
}

const router = routerFactory<ROUTE>({
  [ROUTE.ACCOUNT]: () => <Account />
})

export const { Router, useLocation, useNavigate, useRoute } = router
