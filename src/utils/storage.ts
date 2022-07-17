import { isFileExist, load, save, USER_SETTINGS } from './fs'

interface IStorage {
  version: string
  store: {
    blockchain: Record<string, unknown>
    tokens: Record<string, unknown>
  }
}

type StoreKey = 'blockchain' | 'tokens'

const STORAGE: IStorage = {
  version: '0.0.0',
  store: {
    blockchain: {},
    tokens: {},
  },
}

interface QueueTask {
  data: Record<string, unknown>
  key: StoreKey
}

export class Storage {
  private static instance: Storage

  private storage: IStorage | null = null

  private queue: QueueTask[] = []

  public static async getInstance(): Promise<Storage> {
    if (Storage.instance) {
      return Storage.instance
    }

    await Storage.open()

    return new Storage()
  }

  public static async open() {
    const isExist = await isFileExist(USER_SETTINGS)

    if (!isExist) {
      await save(JSON.stringify(STORAGE, null, 2), USER_SETTINGS)
    }
  }

  add(data: QueueTask) {
    this.queue.push(data)
  }

  async save() {
    if (this.queue.length === 0) return

    const settingsString = await load(USER_SETTINGS)
    const settings = JSON.parse(settingsString) as IStorage

    const { key, data } = this.queue[0]

    console.log(this.queue[0])

    settings.store[key] = {
      ...settings.store[key],
      data,
    }

    await save(settings, USER_SETTINGS)
  }

  async load(key: StoreKey) {
    if (this.storage) {
      return this.storage.store[key]
    }

    const settingsString = await load(USER_SETTINGS)
    const settings = JSON.parse(settingsString) as IStorage

    this.storage = settings

    return this.storage.store[key]
  }
}
