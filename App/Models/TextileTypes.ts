// BEGIN API Types

// private enums to enforce strict id types
// read here: https://basarat.gitbooks.io/typescript/docs/tips/nominalTyping.html#using-enums

import {IProcessingImageProps} from '../Components/ProcessingImage'
import { Photo } from '../NativeModules/Textile'

// export type TextileId = string & { _textileIdBrand: void }
// export type BlockId = string & { _blockIdBrand: void }
// export type ThreadId = string & { _threadIdBrand: void }
// export type PhotoId = string & { _photoIdBrand: void }
// export type PeerId = string & { _peerIdBrand: void }
// export type DeviceId = string & { _deviceIdBrand: void }
// export type ProfileAvatarId = string & { _profileAvatarIdBrand: void }
// export type NotificationId = string & { _notificationIdBrand: void }

// export type UserName = string & { _userNameBrand: void }
// export type ThreadName = string & { _threadNameBrand: void }
// export type DeviceName = string & { _deviceNameBrand: void }
// export type PublicKey = string & { _publicKeyBrand: void }
// export type PrivateKey = string & { _privateKeyBrand: void }
// export type Mnemonic = string & { _mnemonicBrand: void }

export interface IPhotoGridType {
  type: 'photo' | 'processingItem'
  photo: Photo | IProcessingImageProps
  id: string
}

export interface SharedImage {
  origURL?: string,
  uri: string,
  path: string,
  canDelete: boolean
}

export interface DeepLinkData {
  readonly href: string,
  readonly protocol: string,
  readonly host: string,
  readonly hostname: string,
  readonly port: string,
  readonly path: string,
  readonly search: string
  readonly hash: string
}

export interface ILocalPhotoResult {
  assetId: string,
  creationDate: string,
  modificationDate: string,
  orientation: number,
  path: string,
  uri: string,
  canDelete: boolean
}
