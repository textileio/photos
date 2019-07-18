import React, { Component } from 'react'
import { connect } from 'react-redux'
import { SafeAreaView, ViewStyle, FlatList } from 'react-native'

import { NavigationScreenProps } from 'react-navigation'
import { RootState } from '../Redux/Types'

import { Item, TextileHeaderButtons } from '../Components/HeaderButtons'

const CONTAINER: ViewStyle = {
  flex: 1
}

interface StateProps {}

type Props = StateProps & NavigationScreenProps

class QRCode extends Component<Props> {
  static navigationOptions = ({ navigation }: NavigationScreenProps) => {
    const goBack = () => navigation.goBack()
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <Item title="Back" onPress={goBack} iconName="arrow-left" />
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: 'Your QR Code'
    }
  }

  render() {
    return <SafeAreaView style={CONTAINER} />
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {}
}

export default connect(mapStateToProps)(QRCode)
