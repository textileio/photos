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

export const cardImageStyle = (list, index, width) => {
  if (list.length === 1) {
    return {
      width,
      height: 170
    }
  }

  if (list.length === 2) {
    return {
      width: width / 2 - 2,
      height: 170
    }
  }

  if (list.length >= 3 && index === 0) {
    return {
      width: 3 * width / 4 - 2,
      height: 170
    }
  }

  if (list.length >= 3 && index === 1) {
    return {
      width: width / 4 - 1,
      height: 85,
      alignSelf: 'flex-end'
    }
  }

  if (list.length >= 3 && index === 2) {
    return {
      width: width / 4 - 1,
      height: 84,
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
    marginTop: 27,
    marginBottom: 9
  },
  threadCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 5,
    marginHorizontal: 11
  },
  threadCardHeaderLeft: {
  },
  threadCardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    marginHorizontal: 11
  },
  threadCardFooterRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  threadCardFooterRightDetail: {
    marginTop: 1
  },
  threadCardTitle: {
    fontFamily: 'BentonSans',
    fontSize: 28
  },
  detailUpdateTime: {
    fontFamily: 'BentonSans',
    fontSize: 12,
    color: '#9b9b9b'
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
  },
  imageContainer: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageStretch: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
})
