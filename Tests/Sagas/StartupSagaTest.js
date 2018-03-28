import { select, put } from 'redux-saga/effects'
import { selectAvatar, startup } from '../../App/Sagas/StartupSagas'

const stepper = (fn) => (mock) => fn.next(mock).value

test('watches for the right action', () => {
  const step = stepper(startup())
})
