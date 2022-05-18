import fs from 'fs'
import util from 'util'

const writeFile = util.promisify(fs.writeFile)
const readFile = util.promisify(fs.readFile)

const USER_DATA = 'walle.data'

export const save = async (data: string) => {
  // TODO: Add try catch later
  await writeFile(USER_DATA, data)
}

export const load = async () => {
  // TODO: Add try catch later
  const data = await readFile(USER_DATA, 'utf8')
  return JSON.parse(data)
}
