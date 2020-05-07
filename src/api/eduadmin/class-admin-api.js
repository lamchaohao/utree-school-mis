import request from '@/utils/request'

export function fetchGradeDataListApi() {
    console.log('api class-admin-api.js request f:fetchGradeDataList ')
    return request({
        url: '/school/classList',
        method: 'post',
        // params: { page: page, limit: limit }
    })
}

export function fetchClassListApi(gradeCode) {
    return request({
        url: '/school/classListSecond',
        method: 'post',
        params: { classGrade: gradeCode }
    })
}

export function createClassApi(gradeCode, classCode) {
    return request({
        url: '/school/addClass',
        method: 'post',
        params: { classGrade: gradeCode, classCode: classCode }
    })
}