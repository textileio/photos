import React from 'react'
import { Image, ImageStyle, Text, TextStyle, View, ViewStyle } from 'react-native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import Button from '../../Components/Button'
import TextileNodeActions, { NodeState } from '../../Redux/TextileNodeRedux'
import { RootAction, RootState } from '../../Redux/Types'
import * as s from '../../Themes/Constants'

const CONTAINER: ViewStyle = {
  flex: 1,
  padding: s.MARGIN_STANDARD,
  backgroundColor: s.COLOR_BACKGROUND_PRIMARY
}

const IMAGE: ImageStyle = {
  marginBottom: s.ITEM_SPACING_LARGE
}

const ITEM: ViewStyle = {
  marginBottom: s.ITEM_SPACING_LARGE
}

const TITLE: TextStyle = {
  ...ITEM,
  ...s.H2
}

const SUBTITLE: TextStyle = {
  ...ITEM,
  ...s.H1
}

class MigrationScreen extends React.Component<{}> {

  render () {
    return (
      <View style={CONTAINER}>
        <Image style={IMAGE} source={require('../../Containers/OnboardingScreen/statics/sync.png')} />
        <Text style={TITLE}>Data Migration</Text>
        <Text style={SUBTITLE}>Please start the migration and leave Textile running in the foreground until complete.</Text>
      </View>
    )
  }
}

export default connect(undefined, undefined)(MigrationScreen)
