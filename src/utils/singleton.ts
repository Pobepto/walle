import { FileHandle } from 'fs/promises'
import { isFileExist, open, save, USER_SETTINGS } from './fs'

const SETTINGS_STRUCTURE = {
  version: '0.0.0',
  store: {
    blockchain: {
      chains: [],
    },
    tokens: {
      tokens: [],
    },
  },
}

class Singleton {
  public message = ''

  private file: FileHandle | undefined = undefined

  constructor() {
    this.message = 'I am an instance'

    this.init()
  }

  init = async () => {
    const isExist = await isFileExist(USER_SETTINGS)
    if (!isExist) {
      await save(JSON.stringify(SETTINGS_STRUCTURE), USER_SETTINGS)
    }

    this.file = await open(USER_SETTINGS)
  }
}

export default new Singleton()
