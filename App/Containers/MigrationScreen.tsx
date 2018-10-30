import React from 'react'
import { Text, ViewStyle, TextStyle } from 'react-native'
import { NavigationStackScreenOptions, SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'

const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'space-around',
  alignItems: 'center',
  backgroundColor: '#FAFCFE',
  padding: 11
}

const TEXT: TextStyle = {
  fontFamily: 'BentonSans',
  fontSize: 18,
  lineHeight: 22,
  textAlign: 'center'
}

class MigrationScreen extends React.Component<{}> {

  // @ts-ignore
  static navigationOptions = ({ navigation }) => {
    const options: NavigationStackScreenOptions = {
      title: 'Migration'
    }
    return options
  }

  render () {
    return (
      <SafeAreaView style={CONTAINER}>
        <Text style={TEXT}>Let's do a migration!</Text>
      </SafeAreaView>
    )
  }
}

export default connect(undefined, undefined)(MigrationScreen)
