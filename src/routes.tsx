import { Contract, PopulatedTransaction } from '@ethersproject/contracts'
import React from 'react'
import { BaseLayout, WelcomeLayout } from './layout'
import {
  Wallet,
  SwitchAccount,
  Login,
  CreateWallet,
  ImportWallet,
  Registration,
  SetPassword,
  Welcome,
  AddToken,
  SwitchChain,
  AddChain,
  ExternalChains,
  TokenActions,
  TokenTransfer,
  TokenInfo,
  CurrencyActions,
  CurrencyTransfer,
  ConfirmTransaction,
  Security,
} from './modules'
import { ForgotPassword } from './modules/welcome/ForgotPassword'
import { routerFactory } from './Router'
import { Token } from './store'

export enum ROUTE {
  WELCOME,
  LOGIN,
  REGISTRATION,
  REGISTRATION_IMPORT,
  REGISTRATION_CREATE,
  REGISTRATION_PASSWORD,
  FORGOT_PASSWORD,
  WALLET,
  SWITCH_ACCOUNT,
  TOKEN_ADD,
  SWITCH_CHAIN,
  ADD_CHAIN,
  EXTERNAL_CHAINS,
  TOKEN_ACTIONS,
  TOKEN_TRANSFER,
  TOKEN_INFO,
  CURRENCY_ACTIONS,
  CURRENCY_TRANSFER,
  CONFIRM_TRANSACTION,
  SECURITY,
}

export interface ROUTE_DATA {
  [ROUTE.TOKEN_ACTIONS]: Token
  [ROUTE.TOKEN_TRANSFER]: Token
  [ROUTE.TOKEN_INFO]: Token
  [ROUTE.CONFIRM_TRANSACTION]: {
    target?: Contract
    populatedTx: PopulatedTransaction
  }
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
  [ROUTE.FORGOT_PASSWORD]: () => welcome(ForgotPassword),
  [ROUTE.WALLET]: () => base(Wallet),
  [ROUTE.SWITCH_ACCOUNT]: () => base(SwitchAccount),
  [ROUTE.ADD_CHAIN]: () => base(AddChain),
  [ROUTE.SWITCH_CHAIN]: () => base(SwitchChain),
  [ROUTE.EXTERNAL_CHAINS]: () => base(ExternalChains),
  [ROUTE.TOKEN_ADD]: () => base(AddToken),
  [ROUTE.TOKEN_ACTIONS]: () => base(TokenActions),
  [ROUTE.TOKEN_TRANSFER]: () => base(TokenTransfer),
  [ROUTE.TOKEN_INFO]: () => base(TokenInfo),
  [ROUTE.CURRENCY_ACTIONS]: () => base(CurrencyActions),
  [ROUTE.CURRENCY_TRANSFER]: () => base(CurrencyTransfer),
  [ROUTE.CONFIRM_TRANSACTION]: () => base(ConfirmTransaction),
  [ROUTE.SECURITY]: () => base(Security),
})

export const { Redirect, Router, useLocation, useNavigate, useRoute, useData } =
  router
