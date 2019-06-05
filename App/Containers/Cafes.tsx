import React from 'react'
import { connect } from 'react-redux'
import { NavigationScreenProps } from 'react-navigation'
import { RootState } from '../Redux/Types'

import { Text, ScrollView, ViewStyle, TextStyle } from 'react-native'
import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'

import { fontFamily, textStyle, spacing, color } from '../styles'

const container: ViewStyle = {
  flex: 1,
  backgroundColor: color.screen_primary,
  padding: spacing._012
}

const address: TextStyle = {
  fontFamily: fontFamily.medium,
  marginBottom: spacing._008
}

interface StateProps {
  cafes: ReadonlyArray<string>
}

type Props = StateProps & NavigationScreenProps<{}>

class Cafes extends React.Component<Props> {
  static navigationOptions = ({ navigation }: NavigationScreenProps<{}>) => {
    const back = () => navigation.goBack()
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <Item title="Back" iconName="arrow-left" onPress={back} />
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: 'Your Cafes'
    }
  }

  render() {
    return (
      <ScrollView style={container}>
        {this.props.cafes.map((cafe, i) => {
          return <Text key={i}>{cafe}</Text>
        })}
      </ScrollView>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  const cafes = state.account.cafeSessions.sessions.map(
    cafe => cafe.cafe.address
  )
  return {
    cafes
  }
}

export default connect(
  mapStateToProps,
  undefined
)(Cafes)
