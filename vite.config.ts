import { loadEnv, ConfigEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { VITE_DROP_CONSOLE } from './config/constant'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const isBuild = command.includes('build')
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const { VITE_PORT, VITE_HOST } = env

  return {
    root: process.cwd(),
    publicDir: 'public',
    base: './',
    plugins: [vue(),
     AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),],
    css: {
      modules: {
        generateScopedName: '[name]__[local]___[hash:base64:5]',
        hashPrefix: 'prefix',
      },
      postcss: {
        plugins: [
          autoprefixer,
          tailwindcss,
        ],
      }
    },
    resolve: {
      alias: {
        '@': `${resolve(__dirname, 'src')}`,
      },
      // 解析package.json中的字段
      mainFields: ['module', 'jsnext:main', 'jsnext'],
      // 导入时想要省略的扩展名列表
      // extensions: ['.less', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
    },
    json: {
      // 是否支持从 .json 文件中进行按名导入
      namedExports: true,
      // 若设置为 true，导入的 JSON 会被转换为 export default JSON.parse("...") 会比转译成对象字面量性能更好， 尤其是当 JSON 文件较大的时候。开启此项，则会禁用按名导入
      stringify: false,
    },
    // 设为 false 可以避免 Vite 清屏而错过在终端中打印某些关键信息
    clearScreen: false,
    // 调整控制台输出的级别 'info' | 'warn' | 'error' | 'silent'
    logLevel: 'info',
    server: {
      open: true,
      host: '0.0.0.0',
      port: parseInt(VITE_PORT),
      // proxy: {
      //   '/api': {
      //     target: VITE_HOST,
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, ''),
      //   },
      // },
    },
    build: {
      target: 'modules',
      outDir: 'build',
      assetsDir: 'assets',
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
      sourcemap: !isBuild,
      chunkSizeWarningLimit: 500,
      emptyOutDir: true,
      manifest: false,
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: VITE_DROP_CONSOLE,
        },
      },
    },
    // 全局变量替换 Record<string, string>
    define: {
      _GLOBAL_VARS_: JSON.stringify({
        ...env,
        MODE: mode,
        BUILD_TIME: new Date().toLocaleString(),
      }),
    },
  }
}
