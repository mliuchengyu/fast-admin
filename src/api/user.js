import request from '@/utils/request';

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  });
}

export function getInfo(token) {
  return request({
    url: '/user-info',
    method: 'get',
    params: { token }
  });
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  });
}

export function getUsers(params) {
  return request({
    url: '/users',
    method: 'get',
    params: params
  });
}

export function addUser(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  });
}

export function updateUser(data, id) {
  return request({
    url: '/users/' + id,
    method: 'put',
    data
  });
}

export function deleteUser(id) {
  return request({
    url: '/users/' + id,
    method: 'delete'
  });
}

export function getCaptcha() {
  return request({
    url: '/captcha',
    method: 'get'
  });
}
