import path from "path";
import { UserConfig, loadEnv, ConfigEnv  } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
import { proxy } from "./src/cool/config/proxy";
import { cool } from "./build/cool";
// @ts-ignore
import { createHtmlPlugin } from "vite-plugin-html";

function resolve(dir: string) {
	return path.resolve(__dirname, ".", dir);
}

// https://vitejs.dev/config

export default ({ mode }: ConfigEnv): UserConfig => {
	// 根据当前工作目录中的 `mode` 加载 .env 文件
	// 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
	const env = loadEnv(mode, process.cwd(), 'VITE_')
	return {
		base: "/",
		plugins: [
			vue(),
			compression(),
			vueJsx(),
			cool(),
			visualizer({
				open: false,
				gzipSize: true,
				brotliSize: true
			}),
			createHtmlPlugin({
				inject: {
					data: {
						...env
					},
				},
			}),
		],
		css: {
			preprocessorOptions: {
				scss: {
					charset: false
				}
			}
		},
		resolve: {
			alias: {
				"/@": resolve("src"),
				"/#": resolve("types"),
				"/$": resolve("src/modules")
			}
		},
		server: {
			port: 9000,
			proxy,
			hmr: {
				overlay: true
			}
		},
		build: {
			minify: "esbuild",
			// terserOptions: {
			// 	compress: {
			// 		drop_console: true,
			// 		drop_debugger: true
			// 	}
			// },
			sourcemap: false,
			rollupOptions: {
				output: {
					chunkFileNames: "static/js/[name]-[hash].js",
					entryFileNames: "static/js/[name]-[hash].js",
					assetFileNames: "static/[ext]/[name]-[hash].[ext]",
					manualChunks(id) {
						if (id.includes("node_modules")) {
							if (!["@cool-vue/crud"].find((e) => id.includes(e))) {
								let str = id.toString().split("node_modules/")[1];

								if (str[0] == "@") {
									str = str.replace("/", ".");
								}

								return str.split("/")[0].toString();
							}
						}
					}
				}
			}
		}
	};
};
