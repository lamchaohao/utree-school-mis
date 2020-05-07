import request from '@/utils/request'

export function fetchTeacherList() {
    console.log('api subject.js request f:fetchSubjectList ')
    return request({
        url: '/school/teacherList',
        method: 'post',
        // params: { page: page, limit: limit }
    })
}

export function fetchTeacherListWithPage(pageIndex, limit) {

    return request({
        url: '/school/teacherList',
        method: 'post',
        params: { page: pageIndex, limit: limit }
    })

}