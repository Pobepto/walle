import React from 'react'
import { BaseLayout, WelcomeLayout } from './layout'
import { Account, CreateWallet, ImportWallet, Registration, Welcome } from './modules'
import { routerFactory } from './Router'

export enum ROUTE {
  WELCOME,
  REGISTRATION,
  REGISTRATION_IMPORT,
  REGISTRATION_CREATE,
  REGISTRATION_PASSWORD,
  ACCOUNT
}

const router = routerFactory<ROUTE>({
  [ROUTE.WELCOME]: () => <WelcomeLayout><Welcome /></WelcomeLayout>,
  [ROUTE.REGISTRATION]: () => <WelcomeLayout><Registration /></WelcomeLayout>,
  [ROUTE.REGISTRATION_IMPORT]: () => <WelcomeLayout><ImportWallet /></WelcomeLayout>,
  [ROUTE.REGISTRATION_CREATE]: () => <WelcomeLayout><CreateWallet /></WelcomeLayout>,
  [ROUTE.REGISTRATION_PASSWORD]: () => <WelcomeLayout><Account /></WelcomeLayout>,
  [ROUTE.ACCOUNT]: () => <BaseLayout><Account /></BaseLayout>
})

export const { Redirect, Router, useLocation, useNavigate, useRoute } = router
