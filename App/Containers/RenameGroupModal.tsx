/*
Container to rename a group.

URL: "RenameGroup"
Parameters:
- threadId: the ID of the group to be renamed

When the user submits a new name or presses back, they are taken back to the
group screen.
*/

import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle
} from 'react-native'
import Modal from 'react-native-modal'
import { color, spacing, size, fontSize, fontFamily } from '../styles'

import { TextileHeaderButtons, Item as TextileHeaderButtonsItem } from '../Components/HeaderButtons'
import Button from '../Components/LargeButton'
import Input from '../SB/components/Input'

import { RootState, RootAction } from '../Redux/Types'
import { groupActions } from '../features/group'

const container: ViewStyle = {
  flex: 1,
  backgroundColor: color.grey_6,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'stretch',
  padding: spacing._024
}

const inputStyle: TextStyle = {
  height: size._064,
  fontSize: fontSize._20,
  color: color.grey_1
}

const buttonContainer: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center'
}

const buttons: ViewStyle = {
  marginTop: spacing._048,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center'
}

const cancelButtonText: TextStyle = {
  color: color.grey_2,
  fontSize: fontSize._20,
  fontFamily: fontFamily.regular,
  textAlign: 'center'
}

const confirmButtonText: TextStyle = {
  color: color.action_2,
  fontSize: fontSize._20,
  fontFamily: fontFamily.regular,
  textAlign: 'center'
}


interface StateProps {
  renaming: boolean
}

interface DispatchProps {
  rename: (newName: string) => void
}

interface ModalProps {
  isVisible: boolean
  threadId: string
  groupName: string
  cancel: () => void
  complete: () => void
}

interface State {
  newName: string,
  startedRename: boolean
}

type Props = StateProps & DispatchProps & ModalProps

class RenameGroupModal extends React.Component<Props, State> {

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
    const disabled = this.state.newName === '' || this.props.renaming
    return (
      <Modal
        isVisible={this.props.isVisible}
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}
        avoidKeyboard={true}
        backdropOpacity={0}
        style={{margin: 0, padding: 0}}
      >
        <View style={container}>
          <Input
            style={inputStyle}
            value={this.state.newName}
            label={this.state.newName === '' ? 'Change the group name' : ''}
            onChangeText={this.handleNewText}
          />
          <View style={buttons}>
            <TouchableOpacity
              style={buttonContainer}
              onPress={this.props.cancel}
            >
              <Text style={cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[buttonContainer, disabled ? { opacity: 0.2 } : {}]}
              disabled={disabled}
              onPress={this.rename}
            >
              <Text style={confirmButtonText}>Rename</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

const mapStateToProps = (state: RootState, ownProps: ModalProps): StateProps => {
  const threadId = ownProps.threadId
  const renaming = Object.keys(state.group.renameGroup).indexOf(threadId) > -1
  return {
    renaming
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>, ownProps: ModalProps): DispatchProps => {
  const threadId = ownProps.threadId
  return {
    rename: (newName: string) => { dispatch(groupActions.renameGroup.renameGroup.request({ threadId, name: newName })) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RenameGroupModal)
