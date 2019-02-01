
export function getHMS() {
  const now = new Date()
  return [
    now.getHours().toString(),
    now.getMinutes().toString(),
    now.getSeconds().toString()
  ].join(':')
}

export function createTimeout(ms: number, promise: Promise<any>): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('timeout'))
    }, ms)
    promise.then(resolve, reject)
  })
}
