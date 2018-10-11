import * as TT from './TextileTypes'

const raw = 'value'

const textileId: TT.TextileId = raw as any & { _textileIdBrand: 'hi' }
const blockId: TT.BlockId = raw as any

describe('textile types', () => {
  describe('descriminators', () => {
    it('should descrimite TextileId', () => {
      expect(TT.descriminators.isTextileId(textileId)).toBeTruthy()
    })
  })
})
