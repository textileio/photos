import PropTypes from 'prop-types'

export default PropTypes.shape({
  image: PropTypes.number,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  previousTitle: PropTypes.string,
  NextTitle: PropTypes.string,
  style: PropTypes.shape({}),
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  order: PropTypes.number.isRequired
})
