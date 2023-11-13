import { Config } from "../types";
import dev from "./dev";
import prod from "./prod";

// 是否开发模式
export const isDev = import.meta.env.MODE === "development";

// 配置
export const config: Config = {
	// 项目信息
	app: {
		// 特征信号知识图谱系统
		// Gun Signal Feature Recording System
		name: "特征信号知识图谱",

		// 菜单
		menu: {
			// 是否分组显示
			isGroup: false,
			// 自定义菜单列表
			list: []
		},

		// 是否显示急速编码按钮
		showAutoMenuBtn: false,

		// 是否显示聊天/信息弹窗
		showClChat: false,

		// 是否显示主题切换按钮
		showClTheme: false,

		// 路由
		router: {
			// 模式
			mode: "history",
			// 转场动画
			transition: "slide",
			// 首页组件
			// home: () => import("/$/demo/views/home/index.vue")
			home: () => import("/$/home/views/index.vue")
		},

		// 字体图标库
		iconfont: []
	},

	// 忽略规则
	ignore: {
		// 不显示请求进度条
		NProgress: ["/", "/base/open/eps", "/base/comm/upload", "/base/comm/uploadMode"],
		// 页面不需要登录验证
		token: ["/login", "/401", "/403", "/404", "/500", "/502"]
	},

	// 调试
	test: {
		token: "",
		mock: false,
		eps: true
	},

	// 当前环境
	...(isDev ? dev : prod)
};

export * from "./proxy";
