/*
Container to rename a group.

URL: "RenameGroup"
Parameters:
- threadId: the ID of the group to be renamed

When the user submits a new name or presses back, they are taken back to the
group screen.
*/

import React from 'react'
import { connect } from 'react-redux'

import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import Modal from 'react-native-modal'

import { TextileHeaderButtons, Item as TextileHeaderButtonsItem } from '../Components/HeaderButtons'
import Button from '../Components/LargeButton'
import Input from '../SB/components/Input'

import { RootState, RootAction } from '../Redux/Types'
import { groupActions } from '../features/group'

import styles from './Styles/RenameGroup'
import { color } from '../styles'

interface StateProps {
  groupName: string
  renaming: boolean
}

interface DispatchProps {
  rename: (newName: string) => void
}

interface ScreenProps {
  cancel: () => void
  complete: () => void
}

interface ModalProps {
  isVisible: boolean
}

interface State {
  newName: string,
  startedRename: false
}

class RenameGroupScreen extends React.Component<ScreenProps & StateProps & DispatchProps, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      newName: props.groupName,
      startedRename: false
    }
  }

  componentDidUpdate() {
    if (this.state.startedRename && !this.props.renaming) {
      this.setState({
        startedRename: false
      })
      this.props.complete()
    }
  }

  render() {
    const groupName = this.props.groupName
    return (
      <View style={styles.container}>
        <Input
          style={styles.inputStyle}
          value={this.state.newName}
          label={this.state.newName === '' ? 'Change the group name' : ''}
          onChangeText={this.handleNewText}
        />
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this.props.cancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            disabled={this.state.newName === '' || this.state.renaming}
            onPress={this.rename}
          >
            <Text style={styles.confirmButtonText}>Rename</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  handleNewText = (text: string) => {
    this.setState({
      newName: text
    })
  }

  rename = () => {
    this.props.rename(this.state.newName)
    this.setState({
      startedRename: true
    })
  }
}

const mapStateToProps = (state: RootState, ownProps: NavigationScreenProps<NavProps>): StateProps => {
  const threadId = ownProps.threadId
  const threadData = state.photoViewing.threads[threadId]
  const groupName = threadData ? threadData.name : 'Unknown'
  const renaming = Object.keys(state.group.renameGroup).indexOf(threadId) > -1
  return {
    groupName,
    renaming
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>, ownProps: NavigationScreenProps<NavProps>) : DispatchProps => {
  const threadId = ownProps.threadId
  return {
    rename: (newName: string) => { dispatch(groupActions.renameGroup.renameGroup.request({ threadId, name: newName })) }
  }
}

export const RenameGroupComponent = connect(mapStateToProps, mapDispatchToProps)(RenameGroupScreen)

export default class RenameGroupModal extends React.Component<ScreenProps & ModalProps> {
  render () {
    return (
      <Modal
        isVisible={this.props.isVisible}
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}
        avoidKeyboard={true}
        backdropOpacity={0}
        style={{margin: 0, padding: 0}}
      >
        <RenameGroupComponent {...this.props} />
      </Modal>
    )
  }
}
