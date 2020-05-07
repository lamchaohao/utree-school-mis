import request from '@/utils/request'


export function login(query) {
    console.log('api user.js request f:login ', query)
    return request({
        url: '/base/login',
        method: 'post',
        params: query,
        data: query
    })
}

export function getInfo(token) {
    return request({
        url: '/vue-element-admin/user/info',
        method: 'get',
        params: { token }
    })
}

export function logout() {
    return request({
        url: '/base/logout',
        method: 'get'
    })
}