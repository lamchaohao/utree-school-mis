import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, setAccountName, getAccountName, setDPath } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: ''
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    }
}

const actions = {
    // user login
    login({ commit }, userInfo) {
        console.log('actions userInfo login----execute', userInfo, commit)

        return new Promise((resolve, reject) => {
            console.log('login actions Promise')
            login({ account: userInfo.account.trim(), password: userInfo.password })
                .then(response => {
                    console.log("login success--", response);
                    if (response.code == 10000) {
                        const { result } = response
                        if (result) {
                            setAccountName(result.company.companyName)
                            setToken(result.company.account)
                            setDPath(result.dpath)
                            commit('SET_NAME', result.company.companyName)
                            commit('SET_TOKEN', result.company.account)

                        } else {
                            setToken('utree-temp-token')
                            commit('SET_NAME', getAccountName())
                            commit('SET_TOKEN', 'utree-temp-token')
                        }
                        resolve(response)
                    } else {
                        console.log("response.code is not 10000")
                        reject(new error('response.code != 10000'))
                    }
                })
                .catch(error => {
                    console.log('user actions login catch error----', error)
                    reject(error)
                })

        })
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                const { data } = response

                if (!data) {
                    reject('Verification failed, please Login again.')
                }

                const { name, avatar } = data

                commit('SET_NAME', name)
                commit('SET_AVATAR', avatar)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                removeToken() // must remove  token  first
                resetRouter()
                commit('RESET_STATE')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}