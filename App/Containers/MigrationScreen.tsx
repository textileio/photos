import React from 'react'
import { Button, Text, TextStyle, ViewStyle } from 'react-native'
import { NavigationStackScreenOptions, SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import { RootAction } from '../Redux/Types'

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

interface DispatchProps {
  startMigration: () => void
}

class MigrationScreen extends React.Component<DispatchProps> {

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
        <Button title={'Start It'} onPress={this.props.startMigration} />
      </SafeAreaView>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  startMigration: () => dispatch(TextileNodeActions.migrateNode())
})

export default connect(undefined, mapDispatchToProps)(MigrationScreen)
