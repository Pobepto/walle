import React from 'react'
import { BaseLayout, WelcomeLayout } from './layout'
import {
  Wallet,
  Login,
  CreateWallet,
  ImportWallet,
  Registration,
  SetPassword,
  Welcome,
  AddToken,
  SwitchChain,
  AddChain,
} from './modules'
import { routerFactory } from './Router'

export enum ROUTE {
  WELCOME,
  LOGIN,
  REGISTRATION,
  REGISTRATION_IMPORT,
  REGISTRATION_CREATE,
  REGISTRATION_PASSWORD,
  WALLET,
  TOKEN_ADD,
  SWITCH_CHAIN,
  ADD_CHAIN,
}

const layout = (
  Layout: React.FC<{ children: React.ReactNode }>,
  Component: React.FC,
) => (
  <Layout>
    <Component />
  </Layout>
)
const welcome = (Component: React.FC) => layout(WelcomeLayout, Component)
const base = (Component: React.FC) => layout(BaseLayout, Component)

const router = routerFactory<ROUTE>({
  [ROUTE.WELCOME]: () => welcome(Welcome),
  [ROUTE.LOGIN]: () => welcome(Login),
  [ROUTE.REGISTRATION]: () => welcome(Registration),
  [ROUTE.REGISTRATION_IMPORT]: () => welcome(ImportWallet),
  [ROUTE.REGISTRATION_CREATE]: () => welcome(CreateWallet),
  [ROUTE.REGISTRATION_PASSWORD]: () => welcome(SetPassword),
  [ROUTE.WALLET]: () => base(Wallet),
  [ROUTE.TOKEN_ADD]: () => base(AddToken),
  [ROUTE.SWITCH_CHAIN]: () => base(SwitchChain),
  [ROUTE.ADD_CHAIN]: () => base(AddChain),
})

export const { Redirect, Router, useLocation, useNavigate, useRoute } = router
