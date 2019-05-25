import React from 'react'
import { connect } from 'react-redux'
import { View, Text, FlatList, Share, ListRenderItemInfo } from 'react-native'
import { NavigationActions, NavigationScreenProps } from 'react-navigation'
import moment from 'moment'

import DeviceLogsActions, {
  DeviceLogsRow
} from '../../../Redux/DeviceLogsRedux'

import {
  TextileHeaderButtons,
  Item as TextileItem
} from '../../../Components/HeaderButtons'

import styles from './statics/styles'
import { RootState, RootAction } from '../../../Redux/Types'
import { Dispatch } from 'redux'

interface NavProps {
  share: () => void
  clear: () => void
}
type Props = DispatchProps & StateProps & NavigationScreenProps<NavProps>
class DeviceLogs extends React.PureComponent<Props> {
  static navigationOptions = ({
    navigation
  }: NavigationScreenProps<NavProps>) => {
    const params = navigation.state.params || {}
    const goBack = () => {
      navigation.dispatch(NavigationActions.back())
    }
    return {
      headerTitle: '',
      headerLeft: (
        <TextileHeaderButtons left={true}>
          <TextileItem title="Back" iconName="arrow-left" onPress={goBack} />
        </TextileHeaderButtons>
      ),
      headerRight: (
        <TextileHeaderButtons right={true}>
          <TextileItem title="Share" onPress={navigation.getParam('share')} />
          <TextileItem title="Clear" onPress={navigation.getParam('clear')} />
        </TextileHeaderButtons>
      )
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      share: this._share,
      clear: () => {
        this.props.clearLogs()
      }
    })
  }

  _share = () => {
    const stringified =
      '```\n' +
      this.props.logs
        .slice(0, 60)
        .map(item => {
          return [
            moment(item.time).format('LTS'),
            item.event,
            item.message,
            item.error
          ].join(', \t')
        })
        .join(' \n') +
      '\n```'
    Share.share({ title: '', message: stringified })
  }

  renderHeader() {
    return (
      <View style={styles.headerRow}>
        <View style={styles.timeCell}>
          <Text style={styles.header}>Time</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.header}>Event</Text>
        </View>
        <View style={styles.messageCell}>
          <Text style={styles.header}>Message</Text>
        </View>
      </View>
    )
  }

  renderRow(row: ListRenderItemInfo<DeviceLogsRow>) {
    const { item } = row
    return (
      <View style={styles.row}>
        <View style={styles.timeCell}>
          <Text style={[item.error && styles.failure, styles.item]}>
            {moment(item.time).format('LTS')}
          </Text>
        </View>
        <View style={styles.cell}>
          <Text style={[item.error && styles.failure, styles.item]}>
            {item.event}
          </Text>
        </View>
        <View style={styles.messageCell}>
          <Text style={[item.error && styles.failure, styles.item]}>
            {item.message}
          </Text>
        </View>
      </View>
    )
  }

  keyExtractor = (item: DeviceLogsRow, index: number) =>
    index.toString() + item.time

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          {this.renderHeader()}
          <FlatList
            data={this.props.logs}
            renderItem={this.renderRow}
            numColumns={1}
            keyExtractor={this.keyExtractor}
            initialNumToRender={100}
          />
        </View>
      </View>
    )
  }
}

interface StateProps {
  logs: ReadonlyArray<DeviceLogsRow>
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    logs: state.deviceLogs.logs
  }
}

interface DispatchProps {
  clearLogs: () => void
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    clearLogs: () => {
      dispatch(DeviceLogsActions.clearLogs())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceLogs)
