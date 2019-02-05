import { TextStyle } from 'react-native'

export const COLOR_BACKGROUND_PRIMARY = '#FAFCFE'
export const COLOR_BACKGROUND_SECONARY = 'white'
export const COLOR_FONT_DARK_ON_LIGHT_LIGHT = '#9b9b9b'
export const COLOR_FONT_DARK_ON_LIGHT_MEDIUM = '#4A4A4A'
export const COLOR_FONT_DARK_ON_LIGHT_DARK = '#1c1c1c'
export const COLOR_BRAND_BLUE = '#2935FF'
export const COLOR_BRAND_YELLOW = '#FFCE00'
export const COLOR_BRAND_RED = '#FF1C3F'
export const COLOR_BRAND_PINK = '#FFB6D5'
export const COLOR_GREY_LIGHT = '#e5e5e5'
export const COLOR_GREY_MEDIUM = '#c6c6c6'

export const FONT_FAMILY_REGULAR = 'Biotif-Regular'
export const FONT_FAMILY_MEDIUM = 'Biotif-Medium'
export const FONT_FAMILY_BOLD = 'Biotif-Bold'

export const FONT_SIZE_SMALL = 11
export const FONT_SIZE_REGULAR = 14
export const FONT_SIZE_MEDIUM = 18
export const FONT_SIZE_LARGE = 24

export const FONT_LINE_HEIGHT_SMALL = 15
export const FONT_LINE_HEIGHT_REGULAR = 18
export const FONT_LINE_HEIGHT_MEDIUM = 24

// 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256
export const SPACING_4 = 4
export const SPACING_8 = 8
export const SPACING_12 = 12
export const SPACING_16 = 16
export const SPACING_24 = 24
export const SPACING_32 = 32
export const SPACING_48 = 48
export const SPACING_64 = 64
export const SPACING_96 = 96
export const SPACING_128 = 128
export const SPACING_192 = 192
export const SPACING_256 = 256

export const MARGIN_EXTRA_SMALL = 8
export const MARGIN_SMALL = 16
export const MARGIN_STANDARD = 20

export const ITEM_SPACING_REGULAR = 8
export const ITEM_SPACING_LARGE = 16

export const H1: TextStyle = {
  fontFamily: FONT_FAMILY_REGULAR,
  fontSize: FONT_SIZE_MEDIUM,
  lineHeight: FONT_LINE_HEIGHT_MEDIUM,
  color: COLOR_FONT_DARK_ON_LIGHT_MEDIUM
}

export const H2: TextStyle = {
  fontFamily: FONT_FAMILY_MEDIUM,
  fontSize: FONT_SIZE_LARGE,
  color: COLOR_FONT_DARK_ON_LIGHT_DARK
}

export const HEADER: TextStyle = {
  fontFamily: FONT_FAMILY_REGULAR,
  fontSize: FONT_SIZE_MEDIUM,
  color: COLOR_FONT_DARK_ON_LIGHT_DARK,
  textTransform: 'uppercase'
}
