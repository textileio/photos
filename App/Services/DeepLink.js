function getParams (hash) {
  let query = hash.replace('#', '')
  let vars = query.split('&')
  let queryString = {}
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=')
    // If first entry with this name
    if (typeof queryString[pair[0]] === 'undefined') {
      queryString[pair[0]] = decodeURIComponent(pair[1])
      // If second entry with this name
    } else if (typeof queryString[pair[0]] === 'string') {
      let arr = [queryString[pair[0]], decodeURIComponent(pair[1])]
      queryString[pair[0]] = arr
      // If third or later entry with this name
    } else {
      queryString[pair[0]].push(decodeURIComponent(pair[1]))
    }
  }
  return queryString
}

function getData (href) {
  var regex = new RegExp([
    '^(https?:)//',
    '(([^:/?#]*)(?::([0-9]+))?)',
    '(/{0,1}[^?#]*)',
    '(\\?[^#]*|)',
    '(#.*|)$'
  ].join(''))
  const match = href.match(regex)
  return match && {
    href: href,
    protocol: match[1],
    host: match[2],
    hostname: match[3],
    port: match[4],
    path: match[5],
    search: match[6],
    hash: match[7]
  }
}

function createInviteLink (invite, threadName) {
  let hash = []
  hash.push('id=' + encodeURIComponent(invite.id))
  hash.push('key=' + encodeURIComponent(invite.key))
  hash.push('inviter=' + encodeURIComponent(invite.inviter))
  hash.push('name=' + encodeURIComponent(threadName))
  return 'https://www.textile.photos/invites/new#' + hash.join('&')
}

function route (link, navigation) {
  if (link) {
    const data = getData(link)
    if (data.path === '/invites/device' && data.hash !== '') {
      // start pairing the new device
      navigation.navigate('PairingView', {request: getParams(data.hash)})
    } else if (data.path === '/invites/new' && data.hash !== '') {
      // invite the user to the thread
      navigation.navigate('ThreadInvite', {link, request: getParams(data.hash)})
    }
  }
}

export default {
  getData,
  getParams,
  createInviteLink,
  route
}
