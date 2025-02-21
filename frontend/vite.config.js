import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',//這是 IPv6 的 localhost 地址。
                                        //您的 Django 服務器可能只監聽 IPv4（127.0.0.1），導致連接被拒絕。
        changeOrigin: true,
      },
      '/media': {  // 新增媒體文件代理
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
