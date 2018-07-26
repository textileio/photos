import PropTypes from 'prop-types'

PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.shape({}),
  PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({})
    ])
  )
])
