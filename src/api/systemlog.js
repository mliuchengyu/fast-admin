import request from '@/utils/request';

export function getSystemlog(params) {
  return request({
    url: '/system_log',
    method: 'get',
    params: params
  });
}
export function postSystemlog(params) {
  return request({
    url: '/system_log',
    method: 'post',
    params: params
  });
}
