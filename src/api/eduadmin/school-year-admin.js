import request from '@/utils/request'


export function fetchSchoolYearList(page, limit) {
    console.log('api school-year-admin.js request f:fetchSchoolYearList ', page, limit)
    return request({
        url: '/school/schoolYearList',
        method: 'post',
        // data: { page: page, limit: limit }
    })
}