import Cookies from 'js-cookie'

const TokenKey = 'utree_token'
const AccountNameKey = 'account_name'
const DocumentPathKey = 'd-path'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

export function setAccountName(name) {
    return Cookies.set(AccountNameKey, name)
}

export function getAccountName() {
    return Cookies.get(AccountNameKey)
}

export function setDPath(dpath) {
    return Cookies.set(DocumentPathKey, dpath)
}

export function getDPath() {
    return Cookies.get(DocumentPathKey)
}