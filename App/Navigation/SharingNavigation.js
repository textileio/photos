import {StackNavigator} from 'react-navigation'
import ThreadSelection from '../Containers/ThreadSelection'
import Comment from '../Containers/Comment'

const SharingNavigation = StackNavigator(
  {
    ThreadSelection: {
      screen: ThreadSelection
    },
    Comment: {
      screen: Comment
    },
    NewThread: {
      screen: ThreadSelection
    }
  },
  {
    headerMode: 'none'
  }
)

export default SharingNavigation
