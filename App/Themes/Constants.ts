import { TextStyle } from 'react-native'

export const COLOR_BACKGROUND_PRIMARY = '#FAFCFE'
export const COLOR_BACKGROUND_SECONARY = 'white'
export const COLOR_FONT_DARK_ON_LIGHT_MEDIUM = '#4A4A4A'
export const COLOR_FONT_DARK_ON_LIGHT_DARK = '#1c1c1c'
export const COLOR_BRAND_BLUE = '#2935FF'
export const COLOR_BRAND_YELLOW = '#FFCE00'
export const COLOR_BRAND_RED = '#FF1C3F'
export const COLOR_BRAND_PINK = '#FFB6D5'
export const COLOR_GREY_LIGHT = '#e5e5e5'

export const FONT_FAMILY_LIGHT = 'BentonSans-Light'
export const FONT_FAMILY_REGULAR = 'BentonSans'
export const FONT_FAMILY_BOLD = 'BentonSans-Bold'

export const FONT_SIZE_REGULAR = 14
export const FONT_SIZE_MEDIUM = 18
export const FONT_SIZE_LARGE = 24

export const FONT_LINE_HEIGHT_MEDIUM = 28

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
  fontFamily: FONT_FAMILY_BOLD,
  fontSize: FONT_SIZE_LARGE,
  color: COLOR_FONT_DARK_ON_LIGHT_DARK
}
