import { Store } from 'redux'
import { RootState } from '../../Redux/Types'
import RNPhotosFramework from 'react-native-photos-framework'

export default class CameraRollEventHandler {
  store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  setup () {
    RNPhotosFramework.onLibraryChange(() => {
      console.log('Library Change')
    })
  }

  tearDown () {
  }
}
