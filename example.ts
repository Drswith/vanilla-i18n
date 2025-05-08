import { $t, createI18n } from './src/index'

const messages = {
  en: {
    hello: 'Hello',
    greet: 'Hello, {0}!',
    user: { info: 'User: {0}, Age: {1}' },
  },
  zh: {
    hello: '你好',
    greet: '你好，{0}！',
    user: { info: '用户：{0}，年龄：{1}' },
  },
}

const i18n = createI18n({
  locale: 'zh',
  fallbackLocale: 'en',
  messages,
  cache: localStorage,
  cacheKey: 'lang',
  changeDocLanguage: true,
  callback: () => {
    render()
  },
})

function render() {
  // 打印当前有的语种和语言包内容
  console.log('当前已存在语种：', Object.keys(i18n.messages))
  Object.keys(i18n.messages).forEach((lang) => {
    console.log(`语言包 [${lang}]：`, i18n.messages[lang])
  })
  const app = document.getElementById('app')!
  app.innerHTML = `
    <h1>${$t('hello')}</h1>
    <p>${$t('greet', 'Vanilla I18n')}</p>
    <button id="btn-en">English</button>
    <button id="btn-zh">中文</button>
    <button id="btn-jp">日语(动态添加)</button>
    <button id="btn-fallback">切换到法语(fr)</button>
    <hr />
    <h2>嵌套 key & 参数占位符</h2>
    <div id="nested-demo">${$t('user.info', 'Tom', 18)}</div>
    <hr />
    <h2>输入名字，体验 greet：</h2>
    <input id="name" placeholder="输入名字" />
    <button id="btn-greet">${$t('greet', '')}</button>
    <div id="result"></div>
    <hr />
    <h2>Fallback 备用语言演示</h2>
    <div id="fallback-demo"></div>
  `
  document.getElementById('btn-en')!.onclick = () => {
    console.log('切换到英文')
    i18n.setLocale('en')
  }
  document.getElementById('btn-zh')!.onclick = () => {
    console.log('切换到中文')
    i18n.setLocale('zh')
  }
  document.getElementById('btn-jp')!.onclick = () => {
    console.log('动态添加日语语言包并切换到日语')
    i18n.setLocaleMessage('jp', {
      hello: 'こんにちは',
      greet: 'こんにちは、{0}さん！',
      user: { info: 'ユーザー：{0}、年齢：{1}' },
    })
    i18n.setLocale('jp')
  }
  document.getElementById('btn-fallback')!.onclick = () => {
    console.log('切换到法语(fr)，未配置法语包，触发 fallback')
    i18n.setLocale('fr')
    const fallbackText = $t('hello')
    document.getElementById('fallback-demo')!.textContent
      = `当前语言: fr，hello: ${fallbackText}（应为英文 fallback）`
    if (fallbackText === 'Hello') {
      console.log('已 fallback 到英文')
    }
    else {
      console.log('未 fallback，当前输出：', fallbackText)
    }
  }
  document.getElementById('btn-greet')!.onclick = () => {
    const name = (document.getElementById('name') as HTMLInputElement).value
    const greetText = $t('greet', name)
    document.getElementById('result')!.textContent = greetText
    console.log('greet 渲染：', greetText)
  }
}

render()
