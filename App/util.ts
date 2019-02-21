import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb'

export function timestampToDate(timestamp?: Timestamp.AsObject) {
  let millis: number
  if (!timestamp) {
    millis = 0
  } else {
    millis = timestamp.seconds as number * 1e3 + timestamp.nanos / 1e6
  }
  return new Date(millis)
}
