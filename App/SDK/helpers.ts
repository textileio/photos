
export function getHMS() {
  const now = new Date()
  return [
    now.getHours().toString(),
    now.getMinutes().toString(),
    now.getSeconds().toString()
  ].join(':')
}
