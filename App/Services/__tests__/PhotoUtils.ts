import { getHeight } from '../PhotoUtils'

describe('photo utils', () => {
  describe('getHeight', () => {
    it('should get the correct increase & decrease height from metadata', () => {
      let result = getHeight(
        {
          width: 200,
          height: 200
        },
        400
      )
      expect(result.known).toEqual(true)
      expect(result.height).toEqual(400)

      result = getHeight(
        {
          width: 200,
          height: 200
        },
        100
      )
      expect(result.known).toEqual(true)
      expect(result.height).toEqual(100)
    })
    it('should used fix ratio if original height dimensions not known', () => {
      const result = getHeight(
        {
          width: 200
        },
        400
      )
      expect(result.known).toEqual(false)
      expect(result.height).toEqual(400 * 0.6)
    })
    it('should used fix ratio if original width dimensions not known', () => {
      const result = getHeight(
        {
          height: 200
        },
        400
      )
      expect(result.known).toEqual(false)
      expect(result.height).toEqual(400 * 0.6)
    })
  })
})
