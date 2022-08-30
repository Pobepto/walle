import { PopulatedTransaction } from '@ethersproject/contracts'
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
  TokenActions,
  Transfer,
  ConfirmTransaction,
} from './modules'
import { routerFactory } from './Router'
import { Token } from './store'

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
  TOKEN_ACTIONS,
  TRANSFER,
  CONFIRM_TRANSACTION,
}

export interface ROUTE_DATA {
  [ROUTE.TOKEN_ACTIONS]: Token
  [ROUTE.TRANSFER]: Token
  [ROUTE.CONFIRM_TRANSACTION]: PopulatedTransaction
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

const router = routerFactory<ROUTE, ROUTE_DATA>({
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
  [ROUTE.TOKEN_ACTIONS]: () => base(TokenActions),
  [ROUTE.TRANSFER]: () => base(Transfer),
  [ROUTE.CONFIRM_TRANSACTION]: () => base(ConfirmTransaction),
})

export const { Redirect, Router, useLocation, useNavigate, useRoute, useData } =
  router
