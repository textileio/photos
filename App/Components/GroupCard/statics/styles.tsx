import { StyleSheet, ImageStyle } from 'react-native'
import * as s from '../../../Themes/Constants'

export const ROW_HEIGHT = 90
export const ROW_COLUMN = 60

export const ICON_WIDTH = ROW_COLUMN * 0.5

export function cardImageStyle (count: number, index: number): ImageStyle {
  const baseStyle = {
    margin: 0,
    padding: 0,
    borderWidth: 2,
    borderColor: s.COLOR_BACKGROUND_PRIMARY
    } as ImageStyle

  if (index >= 8) {
    return {
      display: 'none'
    }
  }

  const marginLeft = index === 0 || index === 4 ? 0 : -(0.27 * ROW_COLUMN)
  const marginBottom = count >= 4 ? -(0.44 * ROW_COLUMN) : 0
  const marginTop = 0
  return {
    ...baseStyle,
    width: ROW_COLUMN * 0.66,
    backgroundColor: 'white', // avoids any transparencies blending
    marginBottom,
    marginLeft,
    marginTop,
    alignSelf: count >= 4 ? 'flex-start' : 'center'
  }
}

export default StyleSheet.create({
  groupCard: {
    flex: 1,
    flexDirection: 'row',
    height: ROW_HEIGHT,
    marginHorizontal: 22,
    alignSelf: 'center',
    borderBottomColor: s.COLOR_GREY_LIGHT,
    borderBottomWidth: 1
  },
  groupRightColumn: {
    width: ROW_COLUMN * 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  avatarContainer: {
    width: ROW_COLUMN * 2,
    height: ROW_HEIGHT / 2,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    flex: 1
  },
  groupMiddleColumn: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 18,
    flex: 1
  },
  groupName: {
    fontFamily: 'Biotif-Regular',
    fontSize: 16,
    lineHeight: ROW_HEIGHT,
    color: s.COLOR_FONT_DARK_ON_LIGHT_MEDIUM
  },
  groupLeftColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ICON_WIDTH * 1.5
  },
  iconStyle: {
    margin: 0,
    padding: 0,
    width: ICON_WIDTH
  },
  imageContainer: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    width: ROW_COLUMN,
    height: ROW_COLUMN
  },
  imageStretch: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
})
