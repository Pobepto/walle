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

    const selectedAccounts: Record<string, string[]> = {}
    Object.keys(requiredNamespaces).forEach((key) => {
      selectedAccounts[key] = [wallet.address]
    })

    const namespaces: SessionTypes.Namespaces = {}
    Object.keys(requiredNamespaces).forEach((key) => {
      const accounts: string[] = []
      requiredNamespaces[key].chains.map((chain) => {
        selectedAccounts[key].map((acc) => accounts.push(`${chain}:${acc}`))
      })
      namespaces[key] = {
        accounts,
        methods: requiredNamespaces[key].methods,
        events: requiredNamespaces[key].events,
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
