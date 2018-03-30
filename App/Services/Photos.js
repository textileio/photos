import {
  AppState,
  CameraRoll,
  AsyncStorage
} from 'react-native';
import RNFS from 'react-native-fs';
import IPFS from '../../TextileIPFSNativeModule';

export default class Photos {

  constructor() {
    this.setup()
  }

  async setup() {
    // await AsyncStorage.removeItem("latestPhotoQueried")
    AppState.addEventListener('change', this.handleAppStateChange)
    console.log('PHOTOS SETUP DONE')
  }

  handleAppStateChange = (nextAppState) => {
    if (nextAppState.match(/^active|^background/)) {
      this.query()
    }
  }

  async query() {
    try {
      const latestPhotoQueried = await AsyncStorage.getItem("latestPhotoQueried")
      if (latestPhotoQueried === null) {
        // If we've never queried a photo, just record the newest photo and we'll start from there next time
        const latestPhoto = await this.getPhoto()
        console.log("NO PREVIOUS PHOTOS QUERIED, SAVING ID:", latestPhoto.pageInfo.end_cursor)
        await AsyncStorage.setItem("latestPhotoQueried", latestPhoto.pageInfo.end_cursor)
      } else {
        // We have a latest photo, so start getting photos until we get to the latest
        let cursor = null // Start with null to get the latest
        let hasNextPage = true
        let photos = new Array()
        while (cursor !== latestPhotoQueried && hasNextPage) {
          const photo = await this.getPhoto(cursor)
          // If the photo we query is the same as the latestPhotoQueried, there is no new photo, break out
          if (photo.pageInfo.end_cursor === latestPhotoQueried) {
            break
          }
          photos.push(photo)
          cursor = photo.pageInfo.end_cursor
          hasNextPage = photo.pageInfo.has_next_page
        }
        for (const photo of photos) {
          // assets-library://asset/asset.JPG?id=FA830DD9-67E7-48ED-BE29-CB4343340D1F&ext=JPG
          var path = photo.node.image.uri
          if (path.includes("assets-library://")) {
            var regex = /[?&]([^=#]+)=([^&#]*)/g,
                params = {},
                match;
            while (match = regex.exec(photo.node.image.uri)) {
              params[match[1]] = match[2];
            }
            path = RNFS.TemporaryDirectoryPath + params.id + '.' + params.ext
            const dest = await RNFS.copyAssetsFileIOS(photo.node.image.uri, path, 0, 0)
          }
          console.log("PINNING PHOTO:", path)
          const hash = await IPFS.addImageAtPath(path)
          console.log("PINNED", hash)
        }
        if (photos.length > 0) {
          const cursor = photos[0].pageInfo.end_cursor
          await AsyncStorage.setItem("latestPhotoQueried", cursor)
        }
      }
    } catch(error) {
      console.log("ERROR QUERING PHOTOS:", error)
    }
  }

  async getPhoto(cursor) {
    let params = { first: 1 }
    if (cursor !== null) {
      params["after"] = cursor
    }
    const photosData = await CameraRoll.getPhotos(params)
    if (photosData.edges.length < 1) {
      return
    }
    const node = photosData.edges[0].node
    return { node: node, pageInfo: photosData.page_info }
  }
}
