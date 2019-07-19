import React, { Component } from 'react'
import {
  ScrollView,
  TextInput,
  Platform,
  Clipboard,
  ActivityIndicator,
  View,
  Text,
  ListRenderItemInfo,
  Animated
} from 'react-native'
import FS from 'react-native-fs'
import { NavigationScreenProps } from 'react-navigation'
import Textile from '@textile/react-native-sdk'
import { TextileHeaderButtons, Item as TextileItem } from './HeaderButtons'
import { color, fontSize, spacing } from '../styles'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import AppConfig from '../Config/app-config'

interface NavProps {
  refresh: () => void
  copy: () => void
}

interface State {
  refreshing: boolean
  logRows: string[]
  fadeOut: Animated.Value
  logData?: string
  selectStart?: number
  error?: string
}

export default class NodeLogsScreen extends Component<
  NavigationScreenProps<NavProps>,
  State
> {
  static navigationOptions = ({
    navigation
  }: NavigationScreenProps<NavProps>) => {
    const refresh = navigation.getParam('refresh')
    const copy = navigation.getParam('copy')
    const goBack = () => navigation.goBack()
    return {
      headerTitle: 'Node Logs',
      headerLeft: (
        <TextileHeaderButtons left={true}>
          <TextileItem title="Back" iconName="arrow-left" onPress={goBack} />
        </TextileHeaderButtons>
      ),
      headerRight: (
        <TextileHeaderButtons>
          <TextileItem title="Copy" iconName="clipboard-plus" onPress={copy} />
          <TextileItem
            title="Refresh"
            iconName="refresh-ccw"
            onPress={refresh}
          />
        </TextileHeaderButtons>
      )
    }
  }

  state: State = {
    refreshing: false,
    logRows: [],
    fadeOut: new Animated.Value(0)
  }

  textInput?: TextInput
  scrollView?: ScrollView

  refreshLogData = async () => {
    this.setState({
      refreshing: true,
      logData: undefined,
      logRows: [],
      error: undefined
    })
    try {
      const logFilePath = `${AppConfig.textileRepoPath}/logs/textile.log`
      const exists = await FS.exists(logFilePath)
      if (exists) {
        const stats = await FS.stat(logFilePath)
        const size = (stats.size as unknown) as number
        const bytesToRead = 1024 * 300 // 300KB
        const offset = Math.max(size, bytesToRead) - bytesToRead
        const contents = await FS.read(logFilePath, bytesToRead, offset, 'utf8')
        this.setState({
          logRows: contents.split('\n').reverse(),
          logData: contents,
          error: undefined
        })
      }
    } catch (error) {
      const message =
        (error.message as string) || (error as string) || 'unknown error'
      this.setState({ error: message })
    } finally {
      this.setState({ refreshing: false })
    }
  }

  // Rarely can the phone handle copy of full logs to clipboard and paste elsewhere, so limiting to 100 rows here
  copyLogData = () => {
    if (this.state.logData) {
      Clipboard.setString(
        this.state.logRows
          .slice(Math.max(this.state.logRows.length - 100, 0))
          .join('\n')
      )
    }
  }

  copyRow = (text: string) => {
    return () => {
      Clipboard.setString(text)
      this.copyNotify()
    }
  }

  scrollToBottom = () => {
    if (this.scrollView) {
      this.scrollView!.scrollToEnd({ animated: true })
    }
  }

  componentWillMount() {
    this.props.navigation.setParams({
      refresh: this.refreshLogData,
      copy: this.copyLogData
    })
    this.refreshLogData()
  }
  copyNotify() {
    this.state.fadeOut.setValue(0.7)
    Animated.timing(this.state.fadeOut, {
      toValue: 0,
      duration: 2000
    }).start()
  }
  renderLogEntry = (row: ListRenderItemInfo<any>) => {
    const { item } = row
    const font = Platform.OS === 'ios' ? 'Courier' : 'monospace'
    return (
      <TouchableOpacity onPress={this.copyRow(item)} activeOpacity={0.75}>
        <Text
          style={{
            fontFamily: font,
            fontSize: fontSize._12,
            color: 'black'
          }}
        >
          {item}
        </Text>
      </TouchableOpacity>
    )
  }

  renderFlatList = () => {
    return (
      <View
        style={{
          flex: 1
        }}
      >
        <FlatList
          inverted={true}
          data={this.state.logRows}
          renderItem={this.renderLogEntry}
          style={{
            flex: 1,
            paddingHorizontal: spacing.screenEdge,
            backgroundColor: color.screen_primary
          }}
        />
        <Animated.View
          style={{
            opacity: this.state.fadeOut,
            position: 'absolute',
            bottom: 0,
            width: '100%'
          }}
        >
          <View
            style={{
              backgroundColor: color.screen_primary,
              paddingVertical: 8
            }}
          >
            <Text
              style={{
                fontSize: 20,
                textAlign: 'center',
                color: 'black'
              }}
            >
              copied
            </Text>
          </View>
        </Animated.View>
      </View>
    )
  }

  renderScrollView = () => {
    return (
      <ScrollView
        ref={ref => {
          this.scrollView = ref ? ref : undefined
        }}
        style={{ flex: 1, backgroundColor: color.screen_primary }}
      >
        <TextInput
          ref={ref => {
            this.textInput = ref ? ref : undefined
          }}
          style={{
            flex: 1,
            fontFamily: 'Courier',
            fontSize: fontSize._12,
            paddingHorizontal: spacing.screenEdge,
            backgroundColor: color.screen_primary
          }}
          editable={false}
          value={this.state.logData}
          multiline={true}
          onContentSizeChange={this.scrollToBottom}
        />
      </ScrollView>
    )
  }

  render() {
    if (this.state.error && this.state.error !== '') {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: color.screen_primary,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text>{this.state.error}</Text>
        </View>
      )
    } else if (this.state.refreshing) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: color.screen_primary,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ActivityIndicator animating={true} size="large" />
        </View>
      )
    } else {
      if (Platform.OS === 'ios') {
        return this.renderScrollView()
      }
      return this.renderFlatList()
    }
  }
}
