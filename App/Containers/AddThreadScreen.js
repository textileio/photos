import React from 'react'
import { connect } from 'react-redux'
import { View, Text, Image, ScrollView } from 'react-native'
import Input from '../SB/components/Input'
import { NavigationActions } from 'react-navigation'
import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'
// import styles from './Styles/AddThreadStyle'
import ThreadsActions from '../Redux/ThreadsRedux'
import styles from '../SB/views/ThreadCreate/statics/styles'

class AddThreadScreen extends React.Component {

  state = {
    value: '',
    submitted: false
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      headerTitle: 'New Thread',
      headerLeft: (
        <TextileHeaderButtons left>
          <Item title='Back' iconName='arrow-left' onPress={() => { navigation.dispatch(NavigationActions.back()) }} />
        </TextileHeaderButtons>
      ),
      headerRight: params.submitEnabled && (
        <TextileHeaderButtons>
          <Item title='Create' onPress={() => params.submit()} />
        </TextileHeaderButtons>
      ),
    }
  }

  handleNewText = (text: string) => {
    this.setState({ value: text})
    this.props.navigation.setParams({
      submit: () => { this._submit() },
      submitEnabled: (text.length > 0)
    })
  }

  componentWillMount () {
    this.props.navigation.setParams({
      submit: () => { this.props.submit(this.state.value) },
      submitEnabled: false
    })
  }

  _submit () {
    this.props.submit(this.state.value)
    this.props.navigation.goBack()
  }

  render () {
    return (
        <ScrollView style={styles.contentContainer}>
          <View>
            <Input
              style={{height: 40}}
              value={this.state.value}
              label={this.state.value === '' ? 'Add a title...' : ''}
              onChangeText={this.handleNewText.bind(this)} />
          </View>
        </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    submit: (name: string) => { dispatch(ThreadsActions.addThreadRequest(name)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddThreadScreen)
