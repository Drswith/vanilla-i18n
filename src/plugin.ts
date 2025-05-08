import type { Plugin } from 'vite'
import path from 'node:path'
import process from 'node:process'
import { createLogger } from 'vite'

const pluginName = 'vite-plugin-locales-import'

const logger = createLogger(undefined, { prefix: pluginName })

export type fileExtension = 'json' | 'js' | 'ts'

export interface localesImportPluginOptions {
  name?: string
  availableLangs?: string[]
  fileExtension?: fileExtension
  dir?: string
}

export default function localesImportPlugin(options?: localesImportPluginOptions): Plugin {
  const {
    name = 'locales-import',
    availableLangs = ['en-US', 'zh-CN'],
    fileExtension = 'json',
    dir = 'src/locales',
  } = options || {}

  // 1. 转为相对路径（相对于项目根目录 process.cwd()）
  let relLocalesDir = path.relative(process.cwd(), dir)
  // 2. 替换为 posix 风格
  relLocalesDir = relLocalesDir.replace(/\\/g, '/')
  // 3. 保证以 / 开头
  const normalizedLocalesDir = `/${relLocalesDir.replace(/^\/+/, '')}`

  const virtualModuleId = `virtual:${name}`
  const resolvedVirtualModuleId = `\0${virtualModuleId}`

  return {
    name: pluginName, // 必须的，将会在 warning 和 error 中显示
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        let importStr = ''
        let exportStr = ''
        availableLangs.forEach((lang, index) => {
          importStr += `import __vite_glob_0_${index} from '${normalizedLocalesDir}/${lang}.${fileExtension}';\n`
          exportStr += `\n  '${lang}': __vite_glob_0_${index},`
        })

        const result = `${importStr}\nexport default {${exportStr}\n};`
        logger.info(result)
        return result
      }
    },
  }
}
