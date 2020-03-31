// 专门处理用户相关的请求
import request from '@/utils/request'
// 登录方法
export function login (data) {
  return request({
    // 配置选项
    url: '/authorizations', // 请求地址
    method: 'post',
    // axios中的body参数 放置在data中
    data// 传入的data
  })
// 返回一个promise对象
}
/***
 *关注用户
 */
export function followUser (data) {
  return request({
    url: '/user/followings',
    method: 'post',
    data // data对象
  })
}
/***
 *取消关注用户
 */
export function unfollowUser (autid) {
  return request({
    url: `/user/followings/${autid}`,
    method: 'delete'
  })
}
