export function emailValid(email?: string) {
  if (!email) {
    return false
  }
  const regexp = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )
  const results = email.match(regexp)
  if (results && results.length > 0) {
    return true
  } else {
    return false
  }
}
