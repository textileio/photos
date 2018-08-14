/* ***********************************************************
* A short word on how to use this automagically generated file.
* We're often asked in the ignite gitter channel how to connect
* to a to a third party api, so we thought we'd demonstrate - but
* you should know you can use sagas for other flow control too.
*
* Other points:
*  - You'll need to add this saga to sagas/index.js
*  - This template uses the api declared in sagas/index.js, so
*    you'll need to define a constant in that file.
*************************************************************/
import { AppState, Share, PermissionsAndroid, Platform } from 'react-native'
import { delay } from 'redux-saga'
import { call, put, select, take, fork } from 'redux-saga/effects'
import BackgroundTimer from 'react-native-background-timer'
import RNFS from 'react-native-fs'
import BackgroundTask from 'react-native-background-task'
import NavigationService from '../Services/NavigationService'
import TextileNode from '../../TextileNode'
import { getPhotos } from '../Services/CameraRoll'
import { getAllPhotos, getPhotoPath, getPage } from '../Services/PhotoUtils'
import StartupActions from '../Redux/StartupRedux'
import UploadingImagesActions, { UploadingImagesSelectors, UploadingImage } from '../Redux/UploadingImagesRedux'
import TextileNodeActions, { TextileNodeSelectors, PhotosQueryResult } from '../Redux/TextileNodeRedux'
import PreferencesActions, { PreferencesSelectors } from '../Redux/PreferencesRedux'
import { ThreadsSelectors } from '../Redux/ThreadsRedux'
import AuthActions, { AuthSelectors } from '../Redux/AuthRedux'
import ContactsActions, { ContactsSelectors } from '../Redux/ContactsRedux'
import UIActions from '../Redux/UIRedux'
import ThreadsActions from '../Redux/ThreadsRedux'
import DevicesActions from '../Redux/DevicesRedux'
import Upload from 'react-native-background-upload'
import Config from 'react-native-config'
import { ActionType, getType } from 'typesafe-actions'
import * as TextileTypes from '../Models/TextileTypes'
import * as CameraRoll from '../Services/CameraRoll'
import CameraRollActions, { cameraRollSelectors, QueriedPhotosMap } from '../Redux/CameraRollRedux'
import DeepLink from '../Services/DeepLink'

export function * signUp (action: ActionType<typeof AuthActions.signUpRequest>) {
  const {referralCode, username, email, password} = action.payload
  try {
    yield call(TextileNode.signUpWithEmail, email, username, password, referralCode)
    const tokens = yield call(TextileNode.getTokens)
    yield put(AuthActions.getTokensSuccess(tokens))
    // TODO: Put username into textile-go for addition to metadata model
    yield put(AuthActions.signUpSuccess())
    yield call(NavigationService.navigate, 'ProfilePic')
  } catch (error) {
    yield put(AuthActions.signUpFailure(error))
  }
}

export function * logOut (action: ActionType<typeof AuthActions.logOutRequest>) {
  try {
    yield call(TextileNode.signOut)
    yield call(NavigationService.navigate, 'OnboardingNavigation')
  } catch (error) {
    yield put(AuthActions.logOutFailure(error))
  }
}

export function * logIn (action: ActionType<typeof AuthActions.logInRequest>) {
  const {username, password} = action.payload
  try {
    yield call(TextileNode.signIn, username, password)
    const tokens = yield call(TextileNode.getTokens)
    yield put(AuthActions.getTokensSuccess(tokens))
    yield put(AuthActions.logInSuccess())
    yield call(NavigationService.navigate, 'ProfilePic')
  } catch (error) {
    yield put(AuthActions.logInFailure(error))
  }
}

export function * recoverPassword (action: ActionType<typeof AuthActions.recoverPasswordRequest>) {
  // TODO: const {username} = action.payload.data
  try {
    yield delay(2000)
    yield put(AuthActions.recoverPasswordSuccess())
  } catch (error) {
    yield put(AuthActions.recoverPasswordFailure(error))
  }
}

export function * handleProfilePhotoSelected(action: ActionType<typeof UIActions.selectProfilePicture>) {
  yield put(PreferencesActions.onboardedSuccess())
  yield call(NavigationService.navigate, 'PrimaryNavigation')
  yield take(getType(TextileNodeActions.startNodeSuccess))

  let defaultThread: TextileTypes.Thread | undefined = yield call(getDefaultThread)
  if (!defaultThread) {
    yield put(ThreadsActions.addThreadRequest('default'))
    const action: ActionType<typeof ThreadsActions.addThreadSuccess> = yield take(getType(ThreadsActions.addThreadSuccess))
    defaultThread = action.payload.thread
    yield put(ThreadsActions.refreshThreadsRequest())
  }
  yield processAvatarImage(action.payload.uri, defaultThread)
}

export function * handleProfilePhotoUpdated(action: ActionType<typeof UIActions.updateProfilePicture>) {
  yield call(NavigationService.navigate, 'TabNavigator')

  let defaultThread: TextileTypes.Thread = yield call(getDefaultThread)

  yield processAvatarImage(action.payload.uri, defaultThread)
  yield put(UIActions)
}

function * processAvatarImage(uri: string, defaultThread: TextileTypes.Thread) {
  const photoPath = uri.replace('file://', '')
  try {
    const addResult: TextileTypes.AddResult = yield call(TextileNode.addPhoto, photoPath)
    if (!addResult.archive) {
      throw new Error('no archive returned')
    }
    yield call(TextileNode.addPhotoToThread, addResult.id, addResult.key, defaultThread.id)
    yield put(UploadingImagesActions.addImage(addResult.archive.path, addResult.id, 3))

    yield put(TextileNodeActions.getPhotoHashesRequest(defaultThread.id))

    // set it as our profile picture
    yield put(PreferencesActions.pendingAvatar(addResult.id))

    try {
      yield uploadFile(
        addResult.id,
        addResult.archive.path
      )
    } catch (error) {
      // Leave all the data in place so we can rerty upload
      let message = ''
      if (!error) {
        message = ''
      } else if (typeof error === 'string') {
        message = error
      } else if (error.message) {
        message = error.message
      }
      yield put(UploadingImagesActions.imageUploadError(addResult.id, message))
    }
  } catch (error) {
    // TODO: What do to if adding profile photo fails?
  } finally {
    const exists: boolean = yield call(RNFS.exists, photoPath)
    if (exists) {
      yield call(RNFS.unlink, photoPath)
    }
  }
}

export function * viewThread ( action: ActionType<typeof UIActions.viewThreadRequest> ) {
  try {
    // Refresh our messages
    yield call(TextileNode.refreshMessages)
    yield put(UIActions.refreshMessagesSuccess(Date.now()))
  } catch (error) {
    yield put(UIActions.refreshMessagesFailure(error))
  }
  // Request made from the ThreadsList view
  // Get all items in the thread, or undefined
  const items = yield select(TextileNodeSelectors.itemsByThreadId, action.payload.threadId)
  if (items) {
    for (let item of items) {
      if (item.photo && !item.metadata) {
        // for every item that we don't yet have the metadata for, add it now
        // This step will be greatly improved with paging
        yield call(getPhotoMetadata, {threadId: action.payload.threadId, photoId: item.photo.id})
      }
    }
  }
  yield call(NavigationService.navigate, 'ViewThread', { id: action.payload.threadId, name: action.payload.threadName })
}

export function * viewPhoto ( action: ActionType<typeof UIActions.viewPhotoRequest> ) {
  // Request made from the Wallet view
  // request the metadata for the photo we are about to view full size
  yield call(getPhotoMetadata, action.payload)
  yield call(NavigationService.navigate, 'PhotoViewer')
}

export function * getPhotoMetadata (payload: {threadId: string, photoId: string}) {
  try {
    const existing = yield select(TextileNodeSelectors.metadataById, payload.threadId, payload.photoId)
    if (existing) return
    const metadata: TextileTypes.PhotoMetadata = yield call(TextileNode.getPhotoMetadata, payload.photoId)
    yield put(TextileNodeActions.getPhotoMetadataSuccess(payload.threadId, payload.photoId, metadata))
  } catch (error) {
    yield put(TextileNodeActions.refreshMessagesFailure(error))
  }
}

export function * toggleBackgroundTimer (action: ActionType<typeof TextileNodeActions.lock>) {
  if (action.payload.value) {
    yield call(BackgroundTimer.start)
  } else {
    yield call(BackgroundTimer.stop)
    yield call(BackgroundTask.finish)
  }
}

export function * initializeAppState () {
  yield take(getType(StartupActions.startup))
  const defaultAppState = yield select(TextileNodeSelectors.appState)
  let queriedAppState = defaultAppState
  while (queriedAppState.match(/default|unknown/)) {
    yield delay(10)
    const currentAppState = yield call(() => AppState.currentState)
    queriedAppState = currentAppState || 'unknown'
  }
  yield put(TextileNodeActions.appStateChange(defaultAppState, queriedAppState))
}

export function * handleNewAppState (action: ActionType<typeof TextileNodeActions.appStateChange>) {
  const { previousState, newState } = action.payload
  if (previousState.match(/default|unknown/) && newState === 'background') {
    yield * triggerCreateNode()
  } else if (previousState.match(/default|unknown|inactive|background/) && newState === 'active') {
    yield put(TextileNodeActions.lock(false))
    yield * triggerCreateNode()
  } else if (previousState.match(/inactive|active/) && newState === 'background') {
    yield * triggerStopNode()
  }
}

export function * triggerCreateNode () {
  const locked = yield select(TextileNodeSelectors.locked)
  if (locked) {
    return
  }
  yield put(TextileNodeActions.lock(true))
  yield put(TextileNodeActions.createNodeRequest(RNFS.DocumentDirectoryPath))
}

export function * triggerStopNode () {
  yield put(TextileNodeActions.stopNodeRequest())
}

export function * createNode (action: ActionType<typeof TextileNodeActions.createNodeRequest>) {
  const { path } = action.payload
  try {
    const logLevel = (__DEV__ ? 'DEBUG' : 'INFO')
    const logFiles = !__DEV__
    yield call(TextileNode.create, path, Config.TEXTILE_CAFE_URI, logLevel, logFiles)
    yield put(TextileNodeActions.createNodeSuccess())
    try {
      const mnemonic: string = yield call(TextileNode.mnemonic)
      yield put(PreferencesActions.updatecMnemonic(mnemonic))
    } catch(error) {
      // This only succeeds when the node is first created so this error is expected
    }

    yield put(TextileNodeActions.startNodeRequest())
  } catch (error) {
    yield put(TextileNodeActions.createNodeFailure(error))
    yield put(TextileNodeActions.lock(false))
  }
}

export function * startNode () {
  const onboarded = yield select(PreferencesSelectors.onboarded)
  if (!onboarded) {
    yield put(TextileNodeActions.lock(false))
    return
  }

  try {
    yield call(TextileNode.start)
    yield put(TextileNodeActions.startNodeSuccess())

    // Restore our tokens and username
    const tokens = yield call(TextileNode.getTokens)
    yield put(AuthActions.getTokensSuccess(tokens))

    yield put(ThreadsActions.refreshThreadsRequest())

    // isolate
    try {
      const publicKey = yield call(TextileNode.getPublicKey)
      yield put(PreferencesActions.getPublicKeySuccess(publicKey))
    } catch (error) {}

  } catch (error) {
    yield put(TextileNodeActions.startNodeFailure(error))
    yield put(TextileNodeActions.lock(false))
  }
}

export function * stopNode () {
  yield put(TextileNodeActions.lock(true))
  try {
    yield call(TextileNode.stop)
    yield put(TextileNodeActions.stopNodeSuccess())
  } catch (error) {
    yield put(TextileNodeActions.stopNodeFailure(error))
  } finally {
    yield put(TextileNodeActions.lock(false))
  }
}

export function * refreshMessages (action: ActionType<typeof UIActions.refreshMessagesRequest>) {
  try {
    yield call(TextileNode.refreshMessages)
    yield put(UIActions.refreshMessagesSuccess(Date.now()))
  } catch (error) {
    yield put(UIActions.refreshMessagesFailure(error))
  }
}

export function * getPhotoHashes (action: ActionType<typeof TextileNodeActions.getPhotoHashesRequest>) {
  const { threadId } = action.payload
  try {
    const photos: TextileTypes.Photos = yield call(TextileNode.getPhotos, -1, threadId)
    let data: PhotosQueryResult[] = []
    for (let photo of photos.items) {
      // const metadata: TextileTypes.PhotoMetadata = yield call(TextileNode.getPhotoMetadata, photo.id)
      data.push({ photo })
    }
    yield put(TextileNodeActions.getPhotoHashesSuccess(threadId, data))
  } catch (error) {
    yield put(TextileNodeActions.getPhotoHashesFailure(threadId, error))
  }
}

export function * nodeOnlineSaga () {
  const online = yield select(TextileNodeSelectors.online)
  if (online) {
    try {
      const pending: string = yield select(PreferencesSelectors.pending)
      if (pending) {
        yield call(TextileNode.setAvatarId, pending)
        const profile = yield call(TextileNode.getProfile)
        yield put(PreferencesActions.getProfileSuccess(profile))
      } else {
        // just updated it directly
        const profile = yield call(TextileNode.getProfile)
        yield put(PreferencesActions.getProfileSuccess(profile))
      }
    } catch (error) {
      // nada
    }
  }
}

export function * addDevice (action: ActionType<typeof DevicesActions.addDeviceRequest>) {
  const { name, pubKey } = action.payload
  try {
    yield call(TextileNode.addDevice, name, pubKey)
    yield put(DevicesActions.addDeviceSuccess(pubKey))
  } catch (error) {
    yield put(DevicesActions.addDeviceError(pubKey, error))
  }
}

export function * shareImage (action: ActionType<typeof UIActions.sharePhotoRequest>) {
  try {
    const { id, threadIds, caption} = action.payload
    for (const threadId of threadIds) {
      // TODO: Do something with this blockId
      const blockId: string = yield call(TextileNode.sharePhotoToThread, id, threadId, caption)
      yield put(TextileNodeActions.getPhotoHashesRequest(threadId))
    }
  } catch (error) {
    yield put(UIActions.imageSharingError(error))
  }
}

async function getDefaultThread (): Promise<TextileTypes.Thread | undefined> {
  const threads = await TextileNode.threads()
  var defaultThread = threads.items.find(thread => thread.name === 'default')
  return defaultThread
}

export function * pendingInvitesTask () {
  // Process any pending external invites created while user wasn't logged in
  const threads = yield select(ThreadsSelectors.threads)
  if (threads.pendingInviteLink) {
    yield call(DeepLink.route, threads.pendingInviteLink, NavigationService)
    yield put(ThreadsActions.removeExternalInviteLink())
  }
}

export function * synchronizeNativeUploads() {
  try {
    // THIS COULD potentiall lead to some edge cases where we receive two Error messages
    // back to back... one from here and one later from the Native layer. We should check
    // what is up if that occurs.
    // Grab all the upload Ids from the native layer
    const nativeUploads = yield call(Upload.activeUploads)
    // Grab all the upload Ids from the react native layer
    const reactUploads: string[] = yield select(UploadingImagesSelectors.uploadingImageIds)
    // Check that each upload ID from the react layer exists in the array from the native layer
    // If not, register an image upload error so a retry can happen if necessary
    for (let uploadId of reactUploads) {
      if (!nativeUploads.includes(uploadId)) {
        // Register the error with a normal image action upload error
        yield put(UploadingImagesActions.imageUploadError(uploadId, "Upload not found in native upload queue."))
      }
    }
  } catch (error) {
    yield put(UploadingImagesActions.synchronizeNativeUploadsError(error))
  }
}

export function * chooseProfilePhoto () {
  try {
    const result: { uri: string, data: string } = yield call(CameraRoll.chooseProfilePhoto)
    yield put(UIActions.chooseProfilePhotoSuccess(result.uri, result.data))
  } catch (error) {
    yield put(UIActions.chooseProfilePhotoError(error))
  }
}

export function * photosTask () {
  while (true) {
    // This take effect inside a while loop ensures that the entire photoTask
    // will run before the next startNodeSuccess is received and photoTask run again
    yield take(getType(TextileNodeActions.startNodeSuccess))

    let defaultThread: TextileTypes.Thread | undefined = yield call(getDefaultThread)
    if (!defaultThread) {
      yield put(ThreadsActions.addThreadRequest('default'))
      const action: ActionType<typeof ThreadsActions.addThreadSuccess> = yield take(getType(ThreadsActions.addThreadSuccess))
      defaultThread = action.payload.thread
      yield put(ThreadsActions.refreshThreadsRequest())
    }

    const queriredPhotosInitialized: boolean = yield select(cameraRollSelectors.initialized)
    if (!queriredPhotosInitialized) {
      yield put(CameraRollActions.updateQuerying(true))
      const uris: string[] = yield call(CameraRoll.getPhotos, 1000)
      yield put(CameraRollActions.updateQuerying(false))
      yield put(CameraRollActions.initialzePhotos(uris))
      continue
    }

    yield put(CameraRollActions.updateQuerying(true))
    const uris: string[] = yield call(CameraRoll.getPhotos, 250)
    yield put(CameraRollActions.updateQuerying(false))

    const previouslyQueriedPhotos: QueriedPhotosMap = yield select(cameraRollSelectors.queriedPhotos)

    const urisToProcess = uris.filter(uri => !previouslyQueriedPhotos[uri]).reverse()
    yield put(CameraRollActions.trackPhotos(urisToProcess))

    let addedPhotosData: { uri: string, addResult: TextileTypes.AddResult, blockId: string }[] = []

    for (const uri of urisToProcess) {
      let photoPath = ''
      try {
        photoPath = yield call(CameraRoll.getPhotoPath, uri)
        const addResult: TextileTypes.AddResult = yield call(TextileNode.addPhoto, photoPath)
        if (!addResult.archive) {
          throw new Error('no archive returned')
        }
        const blockId: string = yield call(TextileNode.addPhotoToThread, addResult.id, addResult.key, defaultThread.id)
        yield put(UploadingImagesActions.addImage(addResult.archive.path, addResult.id, 3))
        yield put(TextileNodeActions.getPhotoHashesRequest(defaultThread.id))
        addedPhotosData.push({ uri, addResult, blockId })
      } catch (error) {
        yield put(CameraRollActions.untrackPhoto(uri))
      } finally {
        const exists: boolean = yield call(RNFS.exists, photoPath)
        if (exists) {
          yield call(RNFS.unlink, photoPath)
        }
      }
    }

    for (const addedPhotoData of addedPhotosData) {
      try {
        if (!addedPhotoData.addResult.archive) {
          throw new Error('no archive to upload')
        }
        yield uploadFile(
          addedPhotoData.addResult.id,
          addedPhotoData.addResult.archive.path
        )
      } catch (error) {
        // Leave all the data in place so we can rerty upload
        let message = ''
        if (!error) {
          message = ''
        } else if (typeof error === 'string') {
          message = error
        } else if (error.message) {
          message = error.message
        }
        yield put(UploadingImagesActions.imageUploadError(addedPhotoData.addResult.id, message))
      }
    }

    // Ensure we don't have any images thought to be uploading that aren't in the native layer
    try {
      yield synchronizeNativeUploads()
    } catch (error) {
      // double certain sync can't interfere with anything
    }
    // Process images for upload retry
    const imagesToRetry: UploadingImage[] = yield select(UploadingImagesSelectors.imagesForRetry)
    for (const imageToRetry of imagesToRetry) {
      try {
        yield uploadFile(imageToRetry.dataId, imageToRetry.path)
      } catch (error) {
        let message = ''
        if (!error) {
          message = ''
        } else if (typeof error === 'string') {
          message = error
        } else if (error.message) {
          message = error.message
        }
        yield put(UploadingImagesActions.imageUploadError(imageToRetry.dataId, message))
      }
    }

    const appState = yield select(TextileNodeSelectors.appState)
    if (appState.match(/background/)) {
      yield * stopNode()
    }
  }
}

export function * removePayloadFile (action: ActionType<typeof UploadingImagesActions.imageUploadComplete>) {
  // TODO: Seeing an error here where the file is sometimes not found on disk...
  const { dataId } = action.payload
  const uploadingImage: UploadingImage = yield select(UploadingImagesSelectors.uploadingImageById, dataId)
  try {
    // Putting this into a try, because although it might be nice to have the
    // error bubble up, we want to be sure we mark the image as uploaded
    yield call(RNFS.unlink, uploadingImage.path)
  } finally {
    yield put(UploadingImagesActions.imageRemovalComplete(dataId))
  }
}

export function * handleUploadError (action: ActionType<typeof UploadingImagesActions.imageUploadError>) {
  const { dataId } = action.payload
  const uploadingImage: UploadingImage = yield select(UploadingImagesSelectors.uploadingImageById, dataId)
  // If there are no more upload attempts, delete the payload file to free up disk space
  if (uploadingImage.remainingUploadAttempts === 0) {
    try {
      yield call(RNFS.unlink, uploadingImage.path)
    } catch (error) { }
    // Commenting this out for now so we can always see the last error that happend,
    // even though we're not going to retry the upload again.
    // yield put(UploadingImagesActions.imageRemovalComplete(dataId))
  }
}

function * uploadFile (id: string, payloadPath: string) {
  let tokens = yield select(AuthSelectors.tokens)
  if (!tokens) {
    tokens = yield call(TextileNode.getTokens)
    yield put(AuthActions.getTokensSuccess(tokens))
  }
  yield call(
    Upload.startUpload,
    {
      customUploadId: id,
      path: payloadPath,
      url: Config.TEXTILE_CAFE_URI + Config.TEXTILE_CAFE_PIN_PATH,
      method: 'POST',
      type: 'raw',
      headers: {
        'Authorization': 'Bearer ' + tokens.access,
        'Content-Type': 'application/gzip'
      }
    }
  )
}

export function * addThread (action: ActionType<typeof ThreadsActions.addThreadRequest>) {
  const { name, mnemonic } = action.payload
  try {
    const thread: TextileTypes.Thread = yield call(TextileNode.addThread, name, mnemonic)
    yield put(ThreadsActions.addThreadSuccess(thread))
    yield put(TextileNodeActions.getPhotoHashesRequest(thread.id))
  } catch (error) {
    yield put(ThreadsActions.addThreadError(error))
  }
}

export function * removeThread (action: ActionType<typeof ThreadsActions.removeThreadRequest>) {
  const { id } = action.payload
  try {
    // TODO: something with this blockId
    const blockId: string = yield call(TextileNode.removeThread, id)
    yield put(ThreadsActions.removeThreadSuccess(id))
    yield call(NavigationService.goBack)
  } catch (error) {
    yield put(ThreadsActions.removeThreadError(error))
  }
}

export function * refreshThreads () {
  try {
    const threads: TextileTypes.Threads = yield call(TextileNode.threads)
    for (const thread of threads.items) {
      yield put(TextileNodeActions.getPhotoHashesRequest(thread.id))
    }
    yield put(ThreadsActions.refreshThreadsSuccess(threads))
  } catch (error) {
    yield put(ThreadsActions.refreshThreadsError(error))
  }
}

export function * showImagePicker(action: ActionType<typeof UIActions.showImagePicker>) {
  const { threadId } = action.payload

  // Present image picker
  const pickerResponse = yield CameraRoll.choosePhoto()
  if (pickerResponse.didCancel) {
    // Detect cancel of image picker
  } else if (pickerResponse.error) {
    //pickerResponse.error is a string... i think all the time
    const error = new Error('Image picker error')
    yield put(UIActions.newImagePickerError(error, 'There was an issue with the photo picker. Please try again.'))
  } else if (pickerResponse.customButton) {
    // pickerResponse.customButton === 'wallet'
    // This shouldn't be possible currently
    yield call(NavigationService.navigate, 'WalletPicker', {shareTo: threadId})
  } else {
    try {
      const image: TextileTypes.SharedImage = {
        origURL: pickerResponse.origURL || pickerResponse.uri,
        uri: pickerResponse.uri,
        height: pickerResponse.height,
        width: pickerResponse.width,
        isVertical: pickerResponse.isVertical
      }
      yield put(CameraRollActions.imagePickerSuccess(threadId, image))
      yield call(NavigationService.navigate, 'SharePhoto', {threadId, image})
    } catch (error) {
      yield put(UIActions.newImagePickerError(error, 'There was an issue with your photo selection. Please try again.'))
    }
  }
​}

export function * localPinRequest(action: ActionType<typeof CameraRollActions.addComment>) {
  const {threadId, image} = action.payload
  const photoPath = image.uri.replace('file://', '')
  try {
    // add the result to our local node
    const addResult: TextileTypes.AddResult = yield call(TextileNode.addPhoto, photoPath)
    if (!addResult.archive) {
      throw new Error('No archive returned')
    }

    // Get the ID of our Default Thread
    let defaultThread: TextileTypes.Thread = yield call(getDefaultThread)
    // Add the image to our defaul thread // i.e the wallet
    yield call(TextileNode.addPhotoToThread, addResult.id, addResult.key, defaultThread.id)

    // Share the photo to the target Thread
    yield call(TextileNode.sharePhotoToThread, addResult.id, threadId, image.caption)
    // Notify the UI to update via updating the hashes
    yield put(TextileNodeActions.getPhotoHashesRequest(threadId))

    // Store the addResult with the image
    yield put(CameraRollActions.localPinSuccess(threadId, image, addResult))
  } catch (error) {
    try {
      yield put(CameraRollActions.imagePinError(threadId, image))
      const exists: boolean = yield call(RNFS.exists, photoPath)
      if (exists) {
        yield call(RNFS.unlink, photoPath)
      }
    } finally {
      yield put(UIActions.newImagePickerError(error, 'There was an issue with your local IPFS node. Please try again.'))
    }
  }
}

export function * remotePinRequest(action: ActionType<typeof CameraRollActions.localPinSuccess>) {
  const {threadId, image, addResult} = action.payload
  // There is a possibility that an image could successfully load into a users thread locally by
  // here, but not succeed with 'UploadingImagesActions.addImage' so never upload
  try {
    if (!addResult.archive) {
      throw new Error('no archive returned')
    }
    // Add the image upload job to the tracked jobs
    yield put(UploadingImagesActions.addImage(addResult.archive.path, addResult.id, 3))

    // Begin the image upload to the Cafe pinner
    yield uploadFile(
      addResult.id,
      addResult.archive.path
    )

    // Remove the image from the CameraRoll actions
    yield put(CameraRollActions.remotePinStarted(threadId, image))

  } catch (error) {
    try {
      yield put(CameraRollActions.imagePinError(threadId, image))
      if (addResult.archive) {
        const exists: boolean = yield call(RNFS.exists, addResult.archive.path)
        if (exists) {
          yield call(RNFS.unlink, addResult.archive.path)
        }
      }
    } finally {
      yield put(UIActions.newImagePickerError(error, 'There was an issue with your connection. Please try again.'))
    }
  }
}

export function * presentPublicLinkInterface(action: ActionType<typeof UIActions.getPublicLink>) {
  const { photoId } = action.payload
  try {
    const key = yield call(TextileNode.getPhotoKey, photoId)
    const link = Config.TEXTILE_CAFE_URI + "/ipfs/" + photoId + "/photo?key=" + key
    yield call(Share.share, {title: '', message: link})
  } catch (error) {}
}

export function * addExternalInvite (action: ActionType<typeof ThreadsActions.addExternalInviteRequest>) {
  const { id, name } = action.payload
  try {
    const invite: TextileTypes.ExternalInvite = yield call(TextileNode.addExternalThreadInvite, id)
    yield put(ThreadsActions.addExternalInviteSuccess(id, name, invite))
  } catch (error) {
    yield put(ThreadsActions.addExternalInviteError(id, error))
  }
}

export function * presentShareInterface(action: ActionType<typeof ThreadsActions.addExternalInviteSuccess>) {
  const { invite, name } = action.payload
  const link = DeepLink.createInviteLink(invite, name)
  yield call(Share.share, { title: 'Join my thread on Textile!', message: link })
}

export function * acceptExternalInvite (action: ActionType<typeof ThreadsActions.acceptExternalInviteRequest>) {
  const { inviteId, key } = action.payload
  try {
    const id: string = yield call(TextileNode.acceptExternalThreadInvite, inviteId, key)
    yield put(ThreadsActions.refreshThreadsRequest())
    yield put(ThreadsActions.acceptExternalInviteSuccess(inviteId, id))
  } catch (error) {
    yield put(ThreadsActions.acceptExternalInviteError(inviteId, error))
  }
}

export function * cameraPermissionsTrigger () {
  // Will trigger a camera permission request
  if (Platform.OS === 'android') {
    const permission = yield call(PermissionsAndroid.request, PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
        'title': 'Textile Photos Photos Permission',
        'message': 'Textile accesses your photo storage to import any new photos you take after you install the app.'
      })
  } else {
    getPhotos(1)
  }
}

export function * backgroundLocationPermissionsTrigger () {
  // Will trigger a camera permission request
  if (Platform.OS === 'android') {
    yield call(PermissionsAndroid.request, PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, 'Background location allows Textile to wake up periodically to check for updates to your camera roll and to check for updates on your peer-to-peer network.')
  } else {
    yield call(navigator.geolocation.requestAuthorization)
  }
}
