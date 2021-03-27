import axios from 'axios';
import { MessageBox, Message, Notification } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken();
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;
    const statusCode = response.status;
    // if the custom code is not 20000, it is judged as an error.
    if (statusCode !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 60 * 1000
      });
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  },
  error => {
    if (!error.response) {
      return;
    }
    console.log(error.response);
    // 对错误进行自定义展示
    const statusCode = error.response.status;
    const res = error.response.data;
    if (statusCode === 401) {
      const res = error.response.data;
      Message.error(res.message);
    } else if (statusCode === 402) {
      // to re-login
      MessageBox.confirm('登陆已经失效', '确认', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload();
        });
      });
    } else if (statusCode === 422) {
      // 表单验证失败之类的错误提示,给出具体错误，可由用户手动关闭，因为有时候错误信息我们需要复制
      if (res.errors) {
        Notification({
          title: '错误通知',
          dangerouslyUseHTMLString: true,
          duration: 0,
          message: `
              <div>${res.message}</div>
              <div>错误详情</div>
              <div>${Object.values(res.errors)}</div>
            `,
          type: 'error'
        });
      } else {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 10 * 1000
        });
        return Promise.reject(new Error(res.message || 'Error'));
      }
    } else if (statusCode === 403) {
      Notification({
        title: '警告',
        dangerouslyUseHTMLString: true,
        duration: 0,
        message: `
            <div>${res.message}</div>
          `,
        type: 'warning'
      });
    } else if (statusCode === 404) {
      // 未找到资源
      console.log(res.message);
      Message({
        message: '找不到资源',
        type: 'error',
        duration: 3 * 1000
      });
    } else {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      });
    }
    return Promise.reject(error);
  }
);

export default service;
