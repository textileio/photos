export default [
  {
    type: 'photo',
    item: {
      userName: 'Harold',
      file: require('./statics/photo1.png'),
      commentQty: 12
    },
    date: {
      month: 'July',
      day: '17'
    }
  }, {
    type: 'contacts',
    items: [
      require('./statics/icon-photo1.png'),
      require('./statics/icon-photo2.png'),
      require('./statics/icon-photo3.png')
    ],
    date: {
      month: 'July',
      day: '17'
    }
  },
  {
    type: 'photo',
    item: {
      userName: 'Jane',
      file: require('./statics/photo2.png'),
      commentQty: 12
    },
    date: {
      month: 'August',
      day: '21'
    }
  }
]
