import { TextileId, IPhotoGridType } from './TextileTypes'

describe('it', () => {
  it('does', () => {
    const item: IPhotoGridType = {
      id: 'sad',
      type: 'photo',
      photo: {
        imageUri: 'asdf',
        progress: 1
      }
    }

    interface That {
      id: string
    }

    const that: That = { id: 'aa'}

    if ((that as IPhotoGridType).type) {
      console.log('HERE ')
    } else {
      console.log('THERE')
    }

    const foo = undefined
    if (foo as any) {
      const bar = 100
      console.log('OK COOL')
    }
  })
})
