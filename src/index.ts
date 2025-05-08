import type { I18nOptions, I18n } from './types'

// 工具函数：通过点语法获取对象属性
function getByPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj)
}

// // 工具函数：简单字符串格式化，支持 {0} {1} ...
function format(str: string, args: any[]): string {
  return str.replace(/\{(\d+)\}/g, (match, index) => (args[index] !== undefined ? args[index] : match))
}

declare global {
  interface Window {
    __VANILLA_I18N__: I18n | null
  }
}

window.__VANILLA_I18N__ = null

export function createI18n(options: I18nOptions): I18n {
  const _messages = options.messages || {}
  const _fallbackLocale = options.fallbackLocale || 'en'
  let _locale = options.locale || _fallbackLocale
  const _cache = options.cache === false ? false : options.cache || localStorage
  const _cacheKey = options.cacheKey || 'language'
  const _callback = options.callback || (() => {})
  const _changeDocLanguage = options.changeDocLanguage !== false

  if (_cache) {
    _locale = _cache.getItem(_cacheKey) || _locale
  }

  if (_changeDocLanguage) {
    document.documentElement.setAttribute('lang', _locale)
  }

  const getLocale = () => _locale

  const setLocale = (locale: string) => {
    _locale = locale
    if (_cache) {
      _cache.setItem(_cacheKey, locale)
    }
    if (_changeDocLanguage) {
      document.documentElement.setAttribute('lang', locale)
    }
    if (window.__VANILLA_I18N__) {
      window.__VANILLA_I18N__.locale = locale
    }
    _callback(locale)
  }

  const getLocaleMessage = (locale: string) => {
    return _messages[locale] || _messages[_fallbackLocale] || {}
  }

  const setLocaleMessage = (locale: string, messages: Record<string, any>) => {
    _messages[locale] = messages
  }

  window.__VANILLA_I18N__ = {
    locale: _locale,
    messages: _messages,
    getLocale,
    setLocale,
    getLocaleMessage,
    setLocaleMessage,
  }

  return window.__VANILLA_I18N__
}

// 别名
export const create = createI18n

export function $t(key: string, ...args: any[]) {
  const i18n = window.__VANILLA_I18N__
  if (!i18n) return key

  let value = getByPath(i18n.getLocaleMessage(i18n.getLocale()), key)
  if (typeof value !== 'string') {
    // fallback 到备用语言
    value = getByPath(i18n.getLocaleMessage(i18n.messages.fallbackLocale || 'en'), key)
  }
  if (typeof value === 'string') {
    return args.length ? format(value, args) : value
  }
  return key
}

