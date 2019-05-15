import React, { Component } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { View, Text, FlatList, ListRenderItemInfo, ViewStyle, Dimensions } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'

import Avatar from '../Components/Avatar'
import TextileImage from '../Components/TextileImage'
import { Item as HeaderItem, TextileHeaderButtons } from '../Components/HeaderButtons'
import { RootAction, RootState } from '../Redux/Types'
import { photosActions, photosSelectors } from '../features/photos'
import { Item } from '../features/photos/models'
import { color } from '../styles'

const { width } = Dimensions.get('window')
const itemSize = width / 3

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.screen_primary
}

interface StateProps {
  items: ReadonlyArray<Item>
  refreshing: boolean
}

interface DispatchProps {
  queryPhotos: () => void
  refreshPhotos: () => void
}

interface NavProps {
  openDrawer: () => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps<NavProps>

class Photos extends Component<Props> {

  static navigationOptions = ({ navigation }: NavigationScreenProps<NavProps>) => {
    const openDrawer = navigation.getParam('openDrawer')
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <HeaderItem
          title='Account'
          onPress={openDrawer}
          ButtonElement={<Avatar style={{ width: 24, height: 24 }} self={true} />}
          buttonWrapperStyle={{ margin: 11 }}
        />
      </TextileHeaderButtons>
    )

    const headerRight = (
      <TextileHeaderButtons>
        <HeaderItem title='Add Group' iconName='plus' />
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: 'Photos',
      headerRight
    }
  }

  componentDidMount() {
    this.props.refreshPhotos()
    this.props.navigation.setParams({
      openDrawer: this.openDrawer
    })
  }

  render() {

    return (
      <View style={CONTAINER}>
        <FlatList
          data={this.props.items}
          renderItem={this.renderRow}
          onRefresh={this.props.refreshPhotos}
          refreshing={this.props.refreshing}
          numColumns={3}
        />
      </View>
    )
  }

  renderRow = (row: ListRenderItemInfo<Item>) => {
    if (row.item.type === 'files') {
      const { files, target } = row.item.files
      const fileIndex = files.length > 0 && files[0].index ? files[0].index : 0
      return (
        <TextileImage
          target={target}
          index={fileIndex}
          forMinWidth={itemSize}
          resizeMode='cover'
          style={{ width: itemSize, height: itemSize }}
        />
      )
    } else {
      return <Text>{row.item.type}</Text>
    }

  }

  openDrawer = () => {
    this.props.navigation.openDrawer()
  }

}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    items: photosSelectors.items(state.photos),
    refreshing: state.photos.photosData.querying
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  queryPhotos: () => dispatch(photosActions.queryCameraRoll.request()),
  refreshPhotos: () => dispatch(photosActions.refreshPhotos.request(undefined))
})

export default connect(mapStateToProps, mapDispatchToProps)(Photos)
