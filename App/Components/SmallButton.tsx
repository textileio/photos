import React from 'react'
import Button from './Button'

interface Props {
  text: string
  backgroundColor?: string
  disabled?: boolean
  onPress?: () => void
}

const button = (props: Props) => {
  const { text, backgroundColor, onPress } = props
  return (
    <Button
      text={text}
      textStyle={{
        fontFamily: 'Biotif-Bold',
        fontSize: 10,
        letterSpacing: 2,
        paddingLeft: 2,
        textTransform: 'uppercase'
      }}
      style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: 'blue'
      }}
      disabled={props.disabled}
      onPress={onPress}
    />
  )
}

export default button
