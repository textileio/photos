import { StyleSheet } from 'react-native'

export const cardImageContainerStyle = list => {
  if (list.length <= 2) {
    return {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  } else {
    return {
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      alignContent: 'stretch',
      height: 170
    }
  }
}

export const cardImageStyle = (list, index) => {
  if (list.length === 1) {
    return {
      width: '100%',
      height: 170
    }
  }

  if (list.length === 2) {
    return {
      width: '49.5%',
      height: 170
    }
  }

  if (list.length >= 3 && index === 0) {
    return {
      width: '74%',
      height: 170
    }
  }

  if (list.length >= 3 && index === 1) {
    return {
      width: '25%',
      height: 85,
      alignSelf: 'flex-end'
    }
  }

  if (list.length >= 3 && index === 2) {
    return {
      width: '25%',
      height: 82,
      alignSelf: 'flex-end'
    }
  }

  if (list.length >= 3 && index > 2) {
    return {
      display: 'none'
    }
  }
}

export default StyleSheet.create({
  threadCard: {
    marginBottom: 37
  },
  threadCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 11
  },
  threadCardHeaderLeft: {},
  threadCardHeaderRight: {},
  threadCardHeaderLeftDetail: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  threadCardTitle: {
    fontFamily: 'BentonSans',
    fontSize: 30,
    marginBottom: 7
  },
  detailUpdateTime: {
    fontFamily: 'BentonSans',
    fontSize: 12,
    color: '#9b9b9b',
    marginRight: 24
  },
  threadCardBody: {},
  moreImages: {
    width: '25%',
    height: 82,
    backgroundColor: 'rgba(38, 37 ,255, 0.5)',
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  moreImagesText: {
    fontFamily: 'BentonSans',
    fontSize: 30,
    color: 'white'
  }
})