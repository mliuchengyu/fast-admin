/**
 * basic基础资料
 * */
import request from '@/utils/request';

// bascs基础数据
export function getCountry(params) {
  return request({
    url: '/country',
    method: 'get',
    params: params
  });
}
export function postCountry(params) {
  return request({
    url: '/country',
    method: 'post',
    params: params
  });
}
export function getCountryDetail(id) {
  return request({
    url: '/country/' + id,
    method: 'get'
  });
}
export function putCountry(data, id) {
  return request({
    url: '/country/' + id,
    method: 'put',
    data
  });
}
export function deleteCountry(id) {
  return request({
    url: '/country/' + id,
    method: 'delete'
  });
}
// Customer information客户资料
export function getCustomer(params) {
  return request({
    url: '/customer',
    method: 'get',
    params: params
  });
}
export function postCustomer(params) {
  return request({
    url: '/customer',
    method: 'post',
    params: params
  });
}
export function getCustomerDetail(id) {
  return request({
    url: '/customer/' + id,
    method: 'get'
  });
}
export function putCustomer(data, id) {
  return request({
    url: '/customer/' + id,
    method: 'put',
    data
  });
}
export function deleteCustomer(id) {
  return request({
    url: '/customer/' + id,
    method: 'delete'
  });
}
// /api/business_type业务类型
export function getBusinesstype(params) {
  return request({
    url: '/business_type',
    method: 'get',
    params: params
  });
}
export function postBusinesstype(params) {
  return request({
    url: '/business_type',
    method: 'post',
    params: params
  });
}
export function getBusinesstypeDetail(id) {
  return request({
    url: '/business_type/' + id,
    method: 'get'
  });
}
export function putBusinesstype(data, id) {
  return request({
    url: '/business_type/' + id,
    method: 'put',
    data
  });
}
export function deleteBusinesstype(id) {
  return request({
    url: '/business_type/' + id,
    method: 'delete'
  });
}
// /api/recipient 收件人管理/收件信息
export function getRecipient(params) {
  return request({
    url: '/recipient',
    method: 'get',
    params: params
  });
}
export function postRecipient(params) {
  return request({
    url: '/recipient',
    method: 'post',
    params: params
  });
}
export function getRecipientDetail(id) {
  return request({
    url: '/recipient/' + id,
    method: 'get'
  });
}
export function putRecipient(data, id) {
  return request({
    url: '/recipient/' + id,
    method: 'put',
    data
  });
}
export function deleteRecipient(id) {
  return request({
    url: '/recipient/' + id,
    method: 'delete'
  });
}
// /api/goods_category 物品类别管理
export function getGoodscategory(params) {
  return request({
    url: '/goods_category',
    method: 'get',
    params: params
  });
}
export function postGoodscategory(params) {
  return request({
    url: '/goods_category',
    method: 'post',
    params: params
  });
}
export function getGoodscategoryDetail(id) {
  return request({
    url: '/goods_category/' + id,
    method: 'get'
  });
}
export function putGoodscategory(data, id) {
  return request({
    url: '/goods_category/' + id,
    method: 'put',
    data
  });
}
export function deleteGoodscategory(id) {
  return request({
    url: '/goods_category/' + id,
    method: 'delete'
  });
}
// /api/problem_category 问题类别管理
export function getProblemcategory(params) {
  return request({
    url: '/problem_category',
    method: 'get',
    params: params
  });
}
export function postProblemcategory(params) {
  return request({
    url: '/problem_category',
    method: 'post',
    params: params
  });
}
export function getProblemcategoryDetail(id) {
  return request({
    url: '/problem_category/' + id,
    method: 'get'
  });
}
export function putProblemcategory(data, id) {
  return request({
    url: '/problem_category/' + id,
    method: 'put',
    data
  });
}
export function deleteProblemcategory(id) {
  return request({
    url: '/problem_category/' + id,
    method: 'delete'
  });
}
// /api/site 站点管理
export function getSite(params) {
  return request({
    url: '/site',
    method: 'get',
    params: params
  });
}

export function getSiteDetail(id) {
  return request({
    url: '/site/' + id,
    method: 'get'
  });
}
export function putSite(data, id) {
  return request({
    url: '/site/' + id,
    method: 'put',
    data
  });
}
// /api/csm 客户结算方式
export function getCsm(params) {
  return request({
    url: '/csm',
    method: 'get',
    params: params
  });
}
export function postCsm(params) {
  return request({
    url: '/csm',
    method: 'post',
    params: params
  });
}
export function getCsmDetail(id) {
  return request({
    url: '/csm/' + id,
    method: 'get'
  });
}
export function putCsm(data, id) {
  return request({
    url: '/csm/' + id,
    method: 'put',
    data
  });
}
export function deleteCsm(id) {
  return request({
    url: '/csm/' + id,
    method: 'delete'
  });
}
// /api/currency 物品类别管理
export function getCurrency(params) {
  return request({
    url: '/currency',
    method: 'get',
    params: params
  });
}
export function postCurrency(params) {
  return request({
    url: '/currency',
    method: 'post',
    params: params
  });
}
export function getCurrencyDetail(id) {
  return request({
    url: '/currency/' + id,
    method: 'get'
  });
}
export function putCurrency(data, id) {
  return request({
    url: '/currency/' + id,
    method: 'put',
    data
  });
}
export function deleteCurrency(id) {
  return request({
    url: '/currency/' + id,
    method: 'delete'
  });
}
// /api/agent 代理资料管理
export function getAgent(params) {
  return request({
    url: '/agent',
    method: 'get',
    params: params
  });
}
export function postAgent(params) {
  return request({
    url: '/agent',
    method: 'post',
    params: params
  });
}
export function getAgentDetail(id) {
  return request({
    url: '/agent/' + id,
    method: 'get'
  });
}
export function putAgent(data, id) {
  return request({
    url: '/agent/' + id,
    method: 'put',
    data
  });
}
export function deleteAgent(id) {
  return request({
    url: '/agent/' + id,
    method: 'delete'
  });
}

// /api/account 财务资料管理
// 账户管理
export function getAccount(params) {
  return request({
    url: '/account',
    method: 'get',
    params: params
  });
}
export function postAccount(params) {
  return request({
    url: '/account',
    method: 'post',
    params: params
  });
}
export function getAccountDetail(id) {
  return request({
    url: '/account/' + id,
    method: 'get'
  });
}
export function putAccount(data, id) {
  return request({
    url: '/account/' + id,
    method: 'put',
    data
  });
}
export function deleteAccount(id) {
  return request({
    url: '/account/' + id,
    method: 'delete'
  });
}
