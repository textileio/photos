import { buffers, channel, Channel } from 'redux-saga'
import { take, put, all, call, fork, cancelled } from 'redux-saga/effects'

export function* createQueue(
  handle: (...args: any[]) => IterableIterator<any>,
  concurrent = 1
) {
  const addTaskChannel: Channel<{}> = yield call(channel, buffers.expanding())
  // create a channel to queue incoming requests
  const runChannel: Channel<{}> = yield call(channel, buffers.expanding())

  function* handleRequest(chan: Channel<{}>) {
    while (true) {
      const payload = yield take(chan)
      yield handle(payload)
    }
  }

  function* watchRequests() {
    try {
      // create n worker 'threads'
      yield all(Array(concurrent).fill(fork(handleRequest, runChannel)))

      while (true) {
        const { payload } = yield take(addTaskChannel)
        yield put(runChannel, payload)
      }
    } finally {
      if (yield cancelled()) {
        addTaskChannel.close()
        runChannel.close()
      }
    }
  }

  return {
    watcher: watchRequests,
    addTaskChannel
  }
}
