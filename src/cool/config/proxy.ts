// import { loadEnv } from 'vite'

// const env = loadEnv(process?.env?.NODE_ENV || '', process.cwd(), 'VITE_')
// const targetUrl = env.VITE_APP_SERVER_TARGET

const targetUrl = 'http://jsq_server:8002'
// const targetUrl = 'http://127.0.0.1:8002'

export const proxy = {
	"/dev/": {
		target: targetUrl,
		changeOrigin: true,
		rewrite: (path: string) => path.replace(/^\/dev/, "")
	},

	// 文件下载
	"/public/uploads/": {
		target: targetUrl,
		changeOrigin: true,
		rewrite: (path: string) => path.replace(/^\/dev/, "")
	},

	"/prod/": {
		target: targetUrl,
		changeOrigin: true,
		rewrite: (path: string) => path.replace(/^\/prod/, "/api")
	}
};
