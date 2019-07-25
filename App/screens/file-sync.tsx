import React, { Component } from 'react'
import {
  View,
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity
} from 'react-native'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { NavigationScreenProps } from 'react-navigation'
import Icon from '@textile/react-native-icon'
import Toast from 'react-native-easy-toast'

import { groupSelectors, groupActions } from '../features/group'
import { Item, TextileHeaderButtons } from '../Components/HeaderButtons'
import ListItem from '../Components/ListItem'
import RowSeparator from '../Components/RowSeparator'
import { RootState, RootAction } from '../Redux/Types'
import { GroupStatus } from '../features/group/file-sync/models'
import { color, size } from '../styles'

interface StateProps {
  readonly groupStatuses: ReadonlyArray<GroupStatus>
}

interface DispatchProps {
  readonly clearGroupStatus: (groupId: string) => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps

class FileSync extends Component<Props> {
  static navigationOptions = ({ navigation }: NavigationScreenProps) => {
    const goBack = () => navigation.goBack()
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <Item title="Back" onPress={goBack} iconName="arrow-left" />
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: 'Active Sync Groups'
    }
  }

  toast?: Toast

  showError = (message: string) => () => {
    if (this.toast) {
      this.toast.show(message, 3000)
    }
  }

  clearStatus = (groupId: string) => () => {
    this.props.clearGroupStatus(groupId)
  }

  keyExtractor = (group: GroupStatus) => group.groupId

  renderRow = ({ item }: ListRenderItemInfo<GroupStatus>) => {
    const {
      groupId,
      numberComplete,
      numberTotal,
      sizeComplete,
      sizeTotal,
      error
    } = item
    const subtitle = `${numberComplete}/${numberTotal} files, ${sizeComplete}/${sizeTotal} bytes`
    let rightItems: JSX.Element[] | undefined
    if (error) {
      rightItems = [
        <TouchableOpacity
          key="alert"
          onPress={this.showError(`${error.id} : ${error.reason}`)}
        >
          <Icon name="alert-circle" size={size._024} color={color.severe_3} />
        </TouchableOpacity>,
        <TouchableOpacity key="clear" onPress={this.clearStatus(groupId)}>
          <Icon name="circle-x" size={size._024} color={color.grey_4} />
        </TouchableOpacity>
      ]
    }
    return (
      <ListItem
        title={item.groupId}
        subtitle={subtitle}
        rightItems={rightItems}
      />
    )
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: color.screen_primary }}>
        <FlatList
          data={this.props.groupStatuses}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderRow}
          ItemSeparatorComponent={RowSeparator}
        />
        <Toast
          ref={toast => {
            this.toast = toast ? toast : undefined
          }}
          position="center"
        />
      </View>
    )
  }
}

function mapStateToProps(state: RootState): StateProps {
  return {
    groupStatuses: groupSelectors.fileSyncSelectors.groupStatuses(
      state.group.fileSync
    )
  }
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>): DispatchProps {
  return {
    clearGroupStatus: (groupId: string) =>
      dispatch(groupActions.fileSync.clearStatus(groupId))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileSync)
