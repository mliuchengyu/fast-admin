import defaultSettings from '@/settings'

const title = defaultSettings.title || '新蜂物流管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
