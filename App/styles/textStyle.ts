import { TextStyle } from 'react-native'
import { fontFamily, fontSize, color } from './'

export const header_xs: TextStyle = {
  fontFamily: fontFamily.bold,
  fontSize: fontSize._12,
  color: color.grey_0
}
export const header_s: TextStyle = {
  fontFamily: fontFamily.bold,
  fontSize: fontSize._16,
  color: color.grey_0
}
export const header_m: TextStyle = {
  fontFamily: fontFamily.medium,
  fontSize: fontSize._20,
  color: color.grey_0
}
export const header_l: TextStyle = {
  fontFamily: fontFamily.regular,
  fontSize: fontSize._30,
  color: color.grey_0
}

export const body_xs: TextStyle = {
  fontFamily: fontFamily.regular,
  fontSize: fontSize._10,
  color: color.grey_0
}
export const body_s: TextStyle = {
  fontFamily: fontFamily.regular,
  fontSize: fontSize._12,
  color: color.grey_0
}
export const body_m: TextStyle = {
  fontFamily: fontFamily.regular,
  fontSize: fontSize._16,
  color: color.grey_0
}
export const body_l: TextStyle = {
  fontFamily: fontFamily.regular,
  fontSize: fontSize._18,
  color: color.grey_0
}

export const body_xs_medium: TextStyle = {
  ...body_xs,
  fontFamily: fontFamily.medium
}
export const body_s_medium: TextStyle = {
  ...body_s,
  fontFamily: fontFamily.medium
}
export const body_m_medium: TextStyle = {
  ...body_m,
  fontFamily: fontFamily.medium
}
export const body_l_medium: TextStyle = {
  ...body_l,
  fontFamily: fontFamily.medium
}

export const body_xs_bold: TextStyle = {
  ...body_xs,
  fontFamily: fontFamily.bold
}
export const body_s_bold: TextStyle = {
  ...body_s,
  fontFamily: fontFamily.bold
}
export const body_m_bold: TextStyle = {
  ...body_m,
  fontFamily: fontFamily.bold
}
export const body_l_bold: TextStyle = {
  ...body_l,
  fontFamily: fontFamily.bold
}
