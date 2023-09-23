import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ElMessage } from "element-plus";
import { endsWith } from "lodash-es";
import { isDev, config } from "/@/cool";
import {storage, uuid} from "/@/cool/utils";
import { useBase } from "/$/base";
import { router } from "/@/cool";

const request = axios.create({
	timeout: 30000,
	withCredentials: false
});

NProgress.configure({
	showSpinner: true
});

// 请求队列
let queue: Array<(token: string) => void> = [];

// 是否刷新中
let isRefreshing = false;

// 请求
request.interceptors.request.use(
	(req: any) => {
		const { user } = useBase();

		if (req.url) {
			// 请求进度条
			if (!config.ignore.NProgress.some((e) => req.url?.includes(e))) {
				NProgress.start();
			}
		}

		// 请求信息
		if (isDev) {
			const requestStartTime = uuid()
			// 增加请求头，用于计算请求耗时
			req.headers['request-start-time'] = requestStartTime
			console.log('')
			console.log('%c 请求：', 'color: #20b2aa;font-weight: bold;')
			console.group(req.url);
			console.time(`${requestStartTime.toString()} 耗时`)
			console.log("method:", req.method);
			console.table("data:", req.method == "get" ? req.params : req.data);
			console.groupEnd();
		}

		// 验证 token
		if (user.token) {
			// 请求标识
			if (req.headers) {
				req.headers["Authorization"] = user.token;
			}

			// 忽略
			if (["eps", "refreshToken"].some((e) => endsWith(req.url, e))) {
				return req;
			}

			// 判断 token 是否过期
			if (storage.isExpired("token")) {
				// 判断 refreshToken 是否过期
				if (storage.isExpired("refreshToken")) {
					ElMessage.error("登录状态已失效，请重新登录");
					user.logout();
				} else {
					// 是否在刷新中
					if (!isRefreshing) {
						isRefreshing = true;

						user.refreshToken()
							.then((token) => {
								queue.forEach((cb) => cb(token));
								queue = [];
								isRefreshing = false;
							})
							.catch(() => {
								user.clear();
							});
					}

					return new Promise((resolve) => {
						// 继续请求
						queue.push((token) => {
							// 重新设置 token
							if (req.headers) {
								req.headers["Authorization"] = token;
							}
							resolve(req);
						});
					});
				}
			}
		}

		return req;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// 响应
request.interceptors.response.use(
	(res) => {
		NProgress.done();

		if (!res?.data) {
			return res;
		}

		const { code, data, message } = res.data;

		if (!code) {
			return res.data;
		}

		switch (code) {
			case 1000:
				if (isDev) {
					const requestStartTime = res.config.headers['request-start-time']
					console.log('')
					console.log('%c 响应：', 'color: #20b2aa;font-weight: bold;')
					console.group(res.config.url);
					console.log("data:", res.data);
					console.timeEnd(`${requestStartTime.toString()} 耗时`)
					console.groupEnd();
				}
				return data;
			default:
				return Promise.reject({ code, message });
		}
	},
	async (error) => {
		NProgress.done();

		if (error.response) {
			const { status, config: c } = error.response;
			const { user } = useBase();

			if (status == 401) {
				user.logout();
			} else {
				if (isDev) {
					if (c.url != `${config.baseUrl}/`) {
						ElMessage.error(`${c.url} ${status}`);
					}
				} else {
					switch (status) {
						case 403:
							router.push("/403");
							break;

						case 500:
							router.push("/500");
							break;

						case 502:
							router.push("/502");
							break;
					}
				}
			}
		}

		return Promise.reject({ message: error.message });
	}
);

export { request };
