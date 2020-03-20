// 负责频道数据
import request from '@/utils/request'
// 获取我的频道数据
export function getMyChannels () {
  return request({
    url: '/user/channels'
  })
}
