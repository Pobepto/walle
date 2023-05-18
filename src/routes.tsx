import React from 'react'
import {
  Contract,
  PreparedTransactionRequest,
  TransactionReceipt,
} from 'ethers'

import { SessionProposal } from './store/wallet-connect/actions'
import { Chain, Token } from './constants'
import { BaseLayout, WelcomeLayout } from './layout'
import {
  Accounts,
  AccountsCreate,
  AddChain,
  AddToken,
  ChangePassword,
  ConfirmTransaction,
  CreateWallet,
  CurrencyActions,
  CurrencyTransfer,
  ExternalChains,
  ForgotPassword,
  Help,
  Home,
  ImportWallet,
  Login,
  PasswordGuard,
  Registration,
  Security,
  SetPassword,
  ShowPrivateKey,
  ShowSeedPhrase,
  SignMessage,
  SwitchChain,
  TokenActions,
  TokenApprove,
  TokenInfo,
  Tokens,
  TokenTransfer,
  TransactionStatus,
  WalletConnect,
  WalletConnectPairings,
  WalletConnectProposal,
  WalletConnectRequests,
  Wallets,
  Welcome,
} from './modules'
import { routerFactory } from './Router'
import { Account } from './store'

export enum ROUTE {
  WELCOME,
  HELP,
  LOGIN,
  REGISTRATION,
  REGISTRATION_IMPORT,
  REGISTRATION_CREATE,
  REGISTRATION_PASSWORD,
  FORGOT_PASSWORD,
  HOME,
  WALLETS,
  ACCOUNTS,
  ACCOUNTS_CREATE,
  TOKEN_ADD,
  SWITCH_CHAIN,
  ADD_CHAIN,
  EXTERNAL_CHAINS,
  TOKENS,
  TOKEN_ACTIONS,
  TOKEN_TRANSFER,
  TOKEN_APPROVE,
  TOKEN_INFO,
  CURRENCY_ACTIONS,
  CURRENCY_TRANSFER,
  CONFIRM_TRANSACTION,
  TRANSACTION_STATUS,
  SIGN_MESSAGE,
  SECURITY,
  SECURITY_SHOW_PRIVATE_KEY,
  SECURITY_SHOW_MNEMONIC,
  SECURITY_CHANGE_PASSWORD,
  WALLET_CONNECT,
  WALLET_CONNECT_PROPOSAL,
  WALLET_CONNECT_REQUESTS,
  WALLET_CONNECT_PAIRINGS,
  PASSWORD_GUARD,
}

interface ROUTE_DATA {
  [ROUTE.LOGIN]: {
    wallet: string
  }
  [ROUTE.FORGOT_PASSWORD]: {
    wallet: string
  }
  [ROUTE.ADD_CHAIN]: {
    chain?: Partial<Chain>
    edit?: boolean
  }
  [ROUTE.TOKEN_ADD]: {
    token?: Partial<Omit<Token, 'chainId'>> & Pick<Token, 'address'>
  }
  [ROUTE.TOKEN_ACTIONS]: Token
  [ROUTE.TOKEN_TRANSFER]: Token
  [ROUTE.TOKEN_APPROVE]: Token
  [ROUTE.TOKEN_INFO]: Token
  [ROUTE.CONFIRM_TRANSACTION]: {
    target?: Contract
    populatedTx: PreparedTransactionRequest
    onRejectTx?: () => void
    onApproveTx?: (hash: string) => void
  }
  [ROUTE.TRANSACTION_STATUS]: {
    receipt?: TransactionReceipt
    error?: string
  }
  [ROUTE.PASSWORD_GUARD]: ROUTE
  [ROUTE.SIGN_MESSAGE]: {
    message: string
    warning?: boolean
    onReject: () => void
    onSign: (signedData: string) => void
  }
  [ROUTE.WALLET_CONNECT]: {
    uri?: string
  }
  [ROUTE.WALLET_CONNECT_PROPOSAL]: {
    proposal: SessionProposal
  }
  [ROUTE.ACCOUNTS_CREATE]: {
    account?: Account
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
const welcome = (Component: React.FC) => () => layout(WelcomeLayout, Component)
const base = (Component: React.FC) => () => layout(BaseLayout, Component)

const router = routerFactory<ROUTE, ROUTE_DATA>({
  [ROUTE.WELCOME]: welcome(Welcome),
  [ROUTE.LOGIN]: welcome(Login),
  [ROUTE.REGISTRATION]: welcome(Registration),
  [ROUTE.REGISTRATION_IMPORT]: welcome(ImportWallet),
  [ROUTE.REGISTRATION_CREATE]: welcome(CreateWallet),
  [ROUTE.REGISTRATION_PASSWORD]: welcome(SetPassword),
  [ROUTE.FORGOT_PASSWORD]: welcome(ForgotPassword),
  [ROUTE.HOME]: base(Home),
  [ROUTE.HELP]: base(Help),
  [ROUTE.WALLETS]: welcome(Wallets),
  [ROUTE.ACCOUNTS]: base(Accounts),
  [ROUTE.ACCOUNTS_CREATE]: base(AccountsCreate),
  [ROUTE.ADD_CHAIN]: base(AddChain),
  [ROUTE.SWITCH_CHAIN]: base(SwitchChain),
  [ROUTE.EXTERNAL_CHAINS]: base(ExternalChains),
  [ROUTE.TOKENS]: base(Tokens),
  [ROUTE.TOKEN_ADD]: base(AddToken),
  [ROUTE.TOKEN_ACTIONS]: base(TokenActions),
  [ROUTE.TOKEN_TRANSFER]: base(TokenTransfer),
  [ROUTE.TOKEN_APPROVE]: base(TokenApprove),
  [ROUTE.TOKEN_INFO]: base(TokenInfo),
  [ROUTE.CURRENCY_ACTIONS]: base(CurrencyActions),
  [ROUTE.CURRENCY_TRANSFER]: base(CurrencyTransfer),
  [ROUTE.CONFIRM_TRANSACTION]: base(ConfirmTransaction),
  [ROUTE.TRANSACTION_STATUS]: base(TransactionStatus),
  [ROUTE.SIGN_MESSAGE]: base(SignMessage),
  [ROUTE.SECURITY]: base(Security),
  [ROUTE.SECURITY_SHOW_PRIVATE_KEY]: base(ShowPrivateKey),
  [ROUTE.SECURITY_SHOW_MNEMONIC]: base(ShowSeedPhrase),
  [ROUTE.SECURITY_CHANGE_PASSWORD]: base(ChangePassword),
  [ROUTE.WALLET_CONNECT]: base(WalletConnect),
  [ROUTE.WALLET_CONNECT_PROPOSAL]: base(WalletConnectProposal),
  [ROUTE.WALLET_CONNECT_REQUESTS]: base(WalletConnectRequests),
  [ROUTE.WALLET_CONNECT_PAIRINGS]: base(WalletConnectPairings),
  [ROUTE.PASSWORD_GUARD]: base(PasswordGuard),
})

export const {
  Router,
  Redirect,
  useLocation,
  useNavigate,
  useRoute,
  useRouteData,
} = router
