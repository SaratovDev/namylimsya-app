import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node', // для серверных утилит не нужен jsdom
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})