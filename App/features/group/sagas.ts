import { all, call } from 'redux-saga/effects'

import { addMessageSaga } from './add-message'
import { feedSaga } from './feed'

export default function * () {
  yield all([
    call(addMessageSaga),
    call(feedSaga)
  ])
}
