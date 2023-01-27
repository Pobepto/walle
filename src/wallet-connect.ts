import type { IKeyValueStorage } from '@walletconnect/keyvaluestorage'
import SignClient from '@walletconnect/sign-client'

import { useWalletConnectStore } from './store'

export let signClient: SignClient

export const initSignClient = async () => {
  const storage: IKeyValueStorage = {
    setItem: (key, value) => {
      const { store } = useWalletConnectStore.getState()
      useWalletConnectStore.setState({
        store: {
          ...store,
          [key]: value,
        },
      })
      return Promise.resolve()
    },
    getItem: (key) => {
      const { store } = useWalletConnectStore.getState()
      return Promise.resolve(store[key])
    },
    removeItem: (key) => {
      const store = { ...useWalletConnectStore.getState().store }
      delete store[key]
      useWalletConnectStore.setState({ store })
      return Promise.resolve()
    },
    getKeys: () => {
      const { store } = useWalletConnectStore.getState()
      return Promise.resolve(Object.keys(store))
    },
    getEntries: () => {
      const { store } = useWalletConnectStore.getState()
      return Promise.resolve(Object.entries(store))
    },
  }

  const opts = {
    projectId: '83bd22fbdde53e66f042e2c6fc181fc3',
    relayUrl: 'wss://relay.walletconnect.com',
    metadata: {
      name: 'Walle CLI',
      description: 'Walle CLI for WalletConnect',
      url: 'https://github.com/Pobepto/walle',
      icons: [
        'https://raw.githubusercontent.com/Pobepto/walle/main/github/500.png',
      ],
    },
    storage,
    logger: 'silent',
  }

  try {
    signClient = await SignClient.init(opts)
  } catch {
    signClient = new SignClient(opts)
  }
}
