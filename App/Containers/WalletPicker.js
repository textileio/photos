import React from 'react'
import { View, Text } from 'react-native'
import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'
import PhotoGrid from '../Components/PhotoGrid'
import { connect } from 'react-redux'
import PreferencesActions from '../Redux/PreferencesRedux'
import TextileNodeActions, { ThreadData, PhotosQueryResult } from '../Redux/TextileNodeRedux'
import style from './Styles/TextilePhotosStyle'
import navStyles from '../Navigation/Styles/NavigationStyles'
import { NavigationActions } from 'react-navigation'

class TextileWalletPicker extends React.PureComponent {
  constructor (props) {
    super(props)
  }

  static navigationOptions = ({ navigation }) => {
    const headerLeft = (
      <TextileHeaderButtons left>
        <Item title='Back' iconName='arrow-left' onPress={() => { navigation.dispatch(NavigationActions.back()) }} />
      </TextileHeaderButtons>
    )
    const headerTitle = (
      <Text style={navStyles.headerTitle}>Choose a Photo</Text>
    )
    return {
      headerTitle,
      headerLeft
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.toggleVerboseUi !== prevProps.toggleVerboseUi
    ) {
      this.props.navigation.setParams({
        toggleVerboseUi: this.props.toggleVerboseUi,
        threadName: this.props.threadName
      })
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      toggleVerboseUi: this.props.toggleVerboseUi,
      threadName: this.props.threadName
    })
  }

  onSelect = (row) => {
    const params = this.props.navigation.state.params
    return () => {
      this.props.navigation.dispatch(NavigationActions.back())
      this.props.navigation.dispatch(
        NavigationActions.navigate({
          routeName: 'SharePhoto',
          params: {
            photo: {id: row.item.photo.id},
            thread: {id: params.shareTo}
          }
        })
      )
    }
  }

  onRefresh () {
    this.props.refresh(this.props.threadId)
  }

  render () {
    return (
      <View style={style.container}>
        <PhotoGrid
          items={this.props.items}
          progressData={this.props.progressData}
          onSelect={this.onSelect}
          onRefresh={this.onRefresh.bind(this)}
          refreshing={this.props.refreshing}
          placeholderText={this.props.placeholderText}
          displayImages={this.props.displayImages}
          verboseUi={this.props.verboseUi}
        />

        {this.props.verboseUi &&
          <View style={style.bottomOverlay} >
            <Text style={style.overlayText}>{this.props.nodeStatus + ' | ' + this.props.queryingCameraRollStatus}</Text>
          </View>
        }
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  // TODO: Can this be a selector?
  const defaultThread = state.threads.threads.find(thread => thread.name === 'default')
  const threadId = defaultThread ? defaultThread.id : undefined

  var items: PhotosQueryResult[] = []
  var refreshing = false
  var thread = undefined
  if (threadId) {
    const threadData: ThreadData = state.textileNode.threads[threadId] || { querying: false, items: [] }
    items = threadData.items
    refreshing = threadData.querying
    thread = state.threads.threads.find(thread => thread.id === threadId)
  }

  // I saw a really weird state where thread was all undefined....
  // seems like we should show a loading state if that ever happens.
  // at the very least i put the user on the default screen instead of a
  // blank Thread screen
  const threadName = thread ? thread.name : undefined

  const nodeStatus = state.textileNode.nodeState.error
    ? 'Error - ' + state.textileNode.nodeState.error.message
    : state.textileNode.nodeState.state

  const queryingCameraRollStatus = state.cameraRoll.querying ? 'querying' : 'idle'

  const placeholderText = state.textileNode.nodeState.state !== 'started'
    ? 'Wallet Status:\n' + nodeStatus
    : 'You need to add some photos first.'

  return {
    threadId,
    threadName,
    items,
    progressData: state.uploadingImages.images,
    refreshing,
    displayImages: state.textileNode.nodeState.state === 'started',
    placeholderText,
    nodeStatus,
    queryingCameraRollStatus,
    verboseUi: state.preferences.verboseUi
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    refresh: (threadId: string) => { dispatch(TextileNodeActions.getPhotoHashesRequest(threadId)) },
    toggleVerboseUi: () => { dispatch(PreferencesActions.toggleVerboseUi()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextileWalletPicker)
