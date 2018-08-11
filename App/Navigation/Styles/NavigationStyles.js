import { StyleSheet } from 'react-native'
import { Colors } from '../../Themes/'

export const headerTintColor = Colors.charcoal

export default StyleSheet.create({

  header: {
    // Styles the screen header in Textile Photos feed view
    // backgroundColor: Colors.brandBlue
    backgroundColor: 'white',
    borderBottomColor: '#ECEDEE',
  },
  headerIconList: {
    width: 23,
    height: 20
  },
  // headerTitle: {
  //   fontFamily: "BentonSans",
  //   fontSize: 30,
  //   paddingTop: 23,
  //   color: Colors.charcoal
  // },

  headerLogo: {
    width: 82.5,
    height: 23
  },
  headerIcon: {
    width: 24,
    height: 24
  },
  headerLeft: {
    height: 16,
    width: 40
  },
  backButtonWrapper: {
    paddingVertical: 5
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  moreButtonWrapper: {
    paddingVertical: 2,
    paddingHorizontal: 6
  },
  headerIconPhoto: {
    height: 24,
    width: 27,
    marginRight: 16
  },
  headerIconMore: {
    height: 4,
    marginVertical: 6, // <- makes it more easily clickable
    width: 16
  },
  bottomBar: {
    width: '100%',
    borderTopColor: '#ECEDEE',
    borderTopWidth: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomBarIcon: {
    height: 24,
    width: 24,
    marginHorizontal: 50,
    marginVertical: 14
  },
  bottomBarIconActive: {
    borderBottomColor: '#2625FF',
    borderBottomWidth: 2
  },

  // END SB Styles

  headerTitleImage: {
    marginHorizontal: 16
  },
  headerTitle: {
    fontFamily: "BentonSans-Bold",
    fontSize: 17,
    paddingTop: 8, // <- needed because BentonSans has that weird bottom gap
    color: Colors.charcoal
  },
  headerButton: {
    fontFamily: 'BentonSans',
    color: Colors.charcoal,
    fontSize: 17
  },
  icon: {
    color: Colors.transparent
  },
  tabStyle: {
    backgroundColor: Colors.transparent,
    borderTopWidth: 0,
    borderTopColor: Colors.charcoal,
    position: 'absolute',
    paddingBottom: 8,
    bottom: 0,
    left: 0,
    right: 0
  }
})
