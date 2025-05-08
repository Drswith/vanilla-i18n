export interface I18nOptions {
  locale: string
  messages: Record<string, any>
  fallbackLocale?: string
  cache?: false | Storage
  cacheKey?: string
  // 改变document.documentElement的语言
  changeDocLanguage?: boolean
  callback?: (locale: string) => void
}

export interface I18n {
  locale: string
  messages: Record<string, any>
  setLocale: (locale: string) => void
  getLocale: () => string
  getLocaleMessage: (locale: string) => Record<string, any>
  setLocaleMessage: (locale: string, messages: Record<string, any>) => void
}
