export interface Contact {
  id: string
  recordID: string
  givenName: string
  familyName: string
  phoneNumbers: Array<{
    label: string
    number: string
  }>
}

export function checkPermission(func: (foo: any, bar: any) => void) {

}

export function requestPermission(func: (foo: any, bar: any) => void) {

}

export function getContactsMatchingString(str: string, func: (foo: any, bar: any) => void) {

}
