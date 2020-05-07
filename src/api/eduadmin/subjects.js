import request from '@/utils/request'

export function fetchSubjectList() {
    console.log('api subject.js request f:fetchSubjectList ')
    return request({
        url: '/school/subjectList',
        method: 'post',
        // data: { page: page, limit: limit }
    })
}

export function createSubjectApi(subName) {
    let subObject = { subjectName: subName }
    console.log('subjectsjs ----function createSubjectApi,', subObject)
    return request({
        url: '/school/addSubject',
        method: 'post',
        params: subObject
    })
}

export function updateSubjectApi(subject) {
    return request({
        url: '/school/upSubject',
        method: 'post',
        params: subject
    })
}

export function deleteSubjectApi(subId) {
    let data = { subjectId: subId }
    return request({
        url: '/school/delSubject',
        method: 'post',
        params: data
    })
}

export function detailForSubject(subId) {
    let data = { subjectId: subId }
    return request({
        url: '/school/subjectRecordList',
        method: 'post',
        params: data
    })
}