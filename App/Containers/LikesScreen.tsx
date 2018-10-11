import React from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { FlatList, ViewStyle, View, ListRenderItemInfo, Text, TextStyle } from 'react-native'

import { RootState } from '../Redux/Types'
import Avatar from '../Components/Avatar'
import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'
import { PeerId, UserName } from '../Models/TextileTypes'

const CONTAINER: ViewStyle = {
  backgroundColor: '#FAFCFE'
}

const LIKE_ITEM: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  margin: 11
}

const LIKE_TEXT: TextStyle = {
  fontFamily: 'BentonSans',
  margin: 11
}

interface StateProps {
  likes: ReadonlyArray<{
    peerId: PeerId,
    username: UserName
  }>
}

class LikesScreen extends React.Component<StateProps & NavigationScreenProps<{}>> {

  static navigationOptions = ({ navigation }) => {
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        {/* tslint:disable-next-line jsx-no-lambda */}
        <Item title='Back' iconName='arrow-left' onPress={() => { navigation.goBack() }} />
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: 'Likes'
    }
  }

  keyExtractor = (item: { peerId: PeerId; username: UserName }, index: number) => {
    return item.username as any + index
  }

  renderItem = (info: ListRenderItemInfo<{ peerId: PeerId; username: UserName }>) => {
    const { peerId, username } = info.item
    const defaultSource = require('../SB/views/Notifications/statics/main-image.png')
    return (
      <View style={LIKE_ITEM}>
        <Avatar width={55} height={55} peerId={peerId} defaultSource={defaultSource} />
        <Text style={LIKE_TEXT}>{username}</Text>
      </View>
    )
  }

  render () {
    return (
      <FlatList
        style={CONTAINER}
        data={this.props.likes}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
      />
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  if (!state.photoViewing.viewingPhoto) {
    throw Error('No viewing photo')
  }
  const likes = state.photoViewing.viewingPhoto.likes.map((like) => {
    const username: UserName = like.username || 'unknown' as any
    return {
      peerId: like.author_id,
      username
    }
  })
  return {
    likes
  }
}

export default connect(mapStateToProps)(LikesScreen)
