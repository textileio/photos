import React from 'react'
import { connect } from 'react-redux'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import Input from '../SB/components/Input'
import { Button } from 'react-native-elements'
import { NavigationActions } from 'react-navigation'
import HeaderButtons from 'react-navigation-header-buttons'
import navStyles from '../Navigation/Styles/NavigationStyles'
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
      headerTitle: undefined,
      headerLeft: (
        <TouchableOpacity onPress={ () => { navigation.dispatch(NavigationActions.back()) }}>
          <Image
            style={navStyles.headerLeft}
            source={require('../SB/views/ThreadsDetail/statics/icon-arrow-left.png')}
          />
        </TouchableOpacity>
      ),
      headerRight: params.submitEnabled && (
        <View style={styles.toolBarRight}>
          <Button
            buttonStyle={{backgroundColor: 'rgba(0,0,0,0)', elevation: 0}}
            titleStyle={styles.link}
            onPress={() => params.submit()}
            title={'Next'}
            color='#fff'
          />
        </View>
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
          <Text style={styles.title}>New thread</Text>
          <View>
            <Input
              style={{height: 40}}
              value={this.state.value}
              label={this.state.value === '' ? 'Add a title...' : ''}
              onChangeText={this.handleNewText.bind(this)}/>
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
