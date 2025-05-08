import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createI18n, $t } from '../src'

const messages = {
  en: {
    hello: 'Hello',
    greet: 'Hello, {0}!',
    nested: { world: 'World' }
  },
  zh: {
    hello: '你好',
    greet: '你好，{0}！'
  }
}

describe('vanilla-i18n', () => {
  beforeEach(() => {
    // 重置全局变量，防止污染
    window.__VANILLA_I18N__ = null
    localStorage.clear()
  })

  it('初始化并获取翻译', () => {
    createI18n({ locale: 'en', messages })
    expect($t('hello')).toBe('Hello')
    expect($t('greet', 'Tom')).toBe('Hello, Tom!')
    expect($t('nested.world')).toBe('World')
  })

  it('切换语言', () => {
    const i18n = createI18n({ locale: 'en', messages })
    i18n.setLocale('zh')
    expect($t('hello')).toBe('你好')
    expect($t('greet', '小明')).toBe('你好，小明！')
  })

  it('找不到 key 返回 key', () => {
    createI18n({ locale: 'en', messages })
    expect($t('not.exist')).toBe('not.exist')
  })

  it('支持 fallbackLocale', () => {
    createI18n({ locale: 'fr', fallbackLocale: 'en', messages })
    expect($t('hello')).toBe('Hello')
  })

  it('setLocaleMessage 可动态添加语言', () => {
    const i18n = createI18n({ locale: 'en', messages })
    i18n.setLocaleMessage('jp', { hello: 'こんにちは' })
    i18n.setLocale('jp')
    expect($t('hello')).toBe('こんにちは')
  })

  it('缓存 locale 到 localStorage', () => {
    createI18n({ locale: 'zh', messages, cache: localStorage, cacheKey: 'lang' })
    expect(localStorage.getItem('lang')).toBe('zh')
  })

  it('未初始化时 $t 返回 key', () => {
    window.__VANILLA_I18N__ = null
    expect($t('hello')).toBe('hello')
  })

  it('切换语言时会调用 callback', () => {
    const callback = vi.fn()
    const i18n = createI18n({ locale: 'en', messages, callback })
    i18n.setLocale('zh')
    expect(callback).toHaveBeenCalledWith('zh')
  })
})
