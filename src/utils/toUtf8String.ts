import { BytesLike, toUtf8String as _toUtf8String } from 'ethers'

export const toUtf8String = (bytes: BytesLike) => {
  try {
    return _toUtf8String(bytes)
  } catch {
    return bytes.toString()
  }
}
