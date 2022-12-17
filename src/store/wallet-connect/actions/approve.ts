import { SessionTypes } from '@walletconnect/types'
import { getWallet, WalletConnectAction } from '@src/store'

export const approve: WalletConnectAction<'approve'> =
  (set, get) => async () => {
    const { signClient, proposal } = get()
    const wallet = getWallet()

    if (!signClient || !proposal) {
      throw new Error('There is no sign client')
    }

    const {
      params: { id, requiredNamespaces, relays },
    } = proposal

    const selectedAccounts = [wallet.address]
    const namespaces: SessionTypes.Namespaces = {}

    Object.entries(requiredNamespaces).forEach(([key, namespace]) => {
      const { chains, methods, events } = namespace
      const accounts = chains
        .map((chain) => {
          return selectedAccounts.map((account) => `${chain}:${account}`)
        })
        .flat()

      namespaces[key] = {
        accounts,
        methods,
        events,
      }
    })

    const { acknowledged } = await signClient.approve({
      id,
      relayProtocol: relays[0].protocol,
      namespaces,
    })

    await acknowledged()

    set({ connected: true })
  }
