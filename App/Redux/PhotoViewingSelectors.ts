import { RootState } from './Types'
import { accountSelectors } from '../features/account'
import { IFiles } from '@textile/react-native-sdk'
import { getSharedThreads } from './GroupsSelectors'

export interface SharedPhoto {
  type: 'photo'
  photo: IFiles
  id: string
  original: string
}

export function photoAndComment(state: RootState) {
  return {
    photo: state.photoViewing.viewingPhoto,
    comment: state.photoViewing.authoringComment
  }
}

export function getSharedPhotos(
  state: RootState,
  sortBy?: 'date'
): SharedPhoto[] {
  const selfAddress = accountSelectors.getAddress(state.account)
  const photos = state.photoViewing.recentPhotos
    .filter(photo => photo.user.address === selfAddress)
    // quickest way to filter out non-cameraroll schema
    .filter(photo => Boolean(photo.files[0].links.thumb))
    .map(
      (photo): SharedPhoto => {
        const file = photo.files[0]
        const thumb = file.links.thumb
        return {
          type: 'photo',
          photo,
          id: photo.block,
          original: thumb.checksum
        }
      }
    )
  const filtered = photos.filter((s1, pos, arr) => {
    return (
      arr.findIndex(s2 => {
        return s2.original === s1.original
      }) === pos
    )
  })
  switch (sortBy) {
    case 'date':
      return filtered.sort((a: SharedPhoto, b: SharedPhoto) => {
        if (a.photo.date.seconds > b.photo.date.seconds) {
          return -1
        }
        return 1
      })
    default:
      return filtered
  }
}
