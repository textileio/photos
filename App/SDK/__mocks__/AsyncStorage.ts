class AsyncStorage {
  setItem = jest.fn((key: string, value: any) => {
      return new Promise((resolve, reject) => {
        this.mockSet(key, value)
        resolve()
      })
  })
  getItem = jest.fn((key: string) => {
      return new Promise((resolve, reject) => {
          resolve(this.mockGet(key))
      })
  })

  data = {}
  mockSet = (key: string, value: any) => {
    this.data[key] = value
  }
  mockGet = (key) => {
    return this.data[key]
  }
}

export default new AsyncStorage()
