import { LocalPhotoResult } from '@textile/react-native-camera-roll'
import { pb } from '@textile/react-native-sdk'

export interface ProcessingPhoto {
  readonly photo: LocalPhotoResult
  readonly state: 'preparing' | 'adding' | 'complete'
  readonly preparedFiles?: pb.IMobilePreparedFiles
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
  files: pb.IFiles
}

export type Item = ProcessingItem | FilesItem
