import { all, call } from 'redux-saga/effects'

import { addMessageSaga } from './add-message'
import { feedSaga } from './feed'
import { renameGroupSaga } from './rename-group'
import { ignoreSaga } from './ignore'
import { addPhotoSaga } from './add-photo'

export default function*() {
  yield all([
    call(addMessageSaga),
    call(feedSaga),
    call(renameGroupSaga),
    call(ignoreSaga),
    call(addPhotoSaga)
  ])
}
