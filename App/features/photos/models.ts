import { LocalPhotoResult } from '@textile/react-native-camera-roll'
import { IMobilePreparedFiles, IFiles } from '@textile/react-native-sdk'

export interface ProcessingPhoto {
  readonly photo: LocalPhotoResult
  readonly state: 'pending' | 'preparing' | 'adding' | 'complete'
  readonly preparedFiles?: IMobilePreparedFiles
  readonly error?: string
}

export interface ProcessingPhotos {
  readonly [key: string]: ProcessingPhoto
}

interface ProcessingItem {
  type: 'processingItem'
  processingPhoto: ProcessingPhoto
}

interface FilesItem {
  type: 'files'
  files: IFiles
}

export type Item = ProcessingItem | FilesItem
