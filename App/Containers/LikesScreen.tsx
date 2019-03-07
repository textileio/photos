import React from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { FlatList, ViewStyle, View, ListRenderItemInfo, Text, TextStyle } from 'react-native'

import { RootState } from '../Redux/Types'
import Avatar from '../Components/Avatar'
import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'
import { color } from '../styles'

const CONTAINER: ViewStyle = {
  backgroundColor: color.screen_primary
}

const LIKE_ITEM: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  margin: 11
}

const LIKE_TEXT: TextStyle = {
  fontFamily: 'Biotif-Regular',
  margin: 11
}

interface StateProps {
  likes: ReadonlyArray<{
    address: string,
    username: string,
    avatar?: string
  }>
}

class LikesScreen extends React.Component<StateProps & NavigationScreenProps<{}>> {
  // @ts-ignore
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

  keyExtractor = (item: { address: string, username: string }, index: number) => {
    return item.username + index
  }

  renderItem = (info: ListRenderItemInfo<{ address: string, username: string, avatar?: string }>) => {
    const { username, avatar } = info.item
    return (
      <View style={LIKE_ITEM}>
        <Avatar style={{ width: 55, height: 55 }} target={avatar} />
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
    const username: string = like.user.name || 'unknown'
    return {
      address: like.user.address,
      username,
      avatar: like.user.avatar
    }
  })
  return {
    likes
  }
}

export default connect(mapStateToProps)(LikesScreen)
