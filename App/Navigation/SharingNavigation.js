import {StackNavigator} from 'react-navigation'
import Threads from '../Containers/Threads'
import Comment from '../Containers/Comment'

const SharingNavigation = StackNavigator(
  {
    Threads: {
      screen: Threads
    },
    Comment: {
      screen: Comment
    },
    NewThread: {
      screen: Threads
    }
  },
  {
    headerMode: 'none'
  }
)

export default SharingNavigation
