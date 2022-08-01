/**
 * 格式化函数 ， 给日期格式化
 * date为 new Date()对象，
 */

export function fromatDate(date) {
  const y = date.getFullYear()
  // .padStart(2, '0') 判断 字符串是否为两位数 否者 前面加上0
  const m = (date.getMonth() + 1 + '').padStart(2, '0')
  const d = (date.getDate() + 1 + '').padStart(2, '0')
  const hh = (date.getHours() + '').padStart(2, '0')
  const mm = (date.getMinutes() + '').padStart(2, '0')
  const ss = (date.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}