import React from 'react'
import { connect } from 'react-redux'
import { View, TextInput } from 'react-native'
import { Button } from 'react-native-elements'
import HeaderButtons from 'react-navigation-header-buttons'
import navStyles from '../Navigation/Styles/NavigationStyles'
import styles from './Styles/AddThreadStyle'
import ThreadsActions from '../Redux/ThreadsRedux'

// export interface Props {
//   headerTitle: string
//   submitText: string
//   submit: (value: string) => void
//   placeholder: string
// }

// export interface State {
//   value: string
// }

class AddThreadScreen extends React.Component {

  state = {
    value: ''
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      headerTitle: 'New Thread',
      headerRight: (
        <Button
          buttonStyle={{backgroundColor: 'rgba(0,0,0,0)'}}
          titleStyle={navStyles.headerButton}
          disabledTitleStyle={{color: 'rgba(255,255,255,0.5)'}}
          onPress={() => params.submit()}
          title={'Create'}
          color="#fff"
          disabled={params.submitDisabled}
        />
        // <HeaderButtons color="white">
        //   <HeaderButtons.Item title="Create" buttonStyle={navStyles.headerButton} onPress={() => console.warn('edit')} />
        // </HeaderButtons>
      ),
    }
  }

  handleNewText = (text: string) => {
    this.setState({ value: text})
    this.props.navigation.setParams({
      submit: () => { this.props.submit(this.state.value) },
      submitDisabled: (text.length === 0)
    })
  }

  componentWillMount () {
    this.props.navigation.setParams({
      submit: () => { this.props.submit(this.state.value) },
      submitDisabled: true
    })
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <TextInput
          style={styles.textInput}
          multiline={false}
          placeholder={'Thread Name...'}
          onChangeText={this.handleNewText}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    submit: (name: string) => { dispatch(ThreadsActions.addThreadRequest(name)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddThreadScreen)
