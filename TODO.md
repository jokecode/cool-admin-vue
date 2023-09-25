## 如何在vite+vue3中的html页面中使用变量？

> **vite版本**：`4.1.5`
>
> **vue版本**：`3.2.47`



### 需要引入新的开发依赖:

```
yarn add vite-plugin-html -D
```



### 修改vite.config.ts文件配置

```ts
...
// @ts-ignore
import { createHtmlPlugin } from "vite-plugin-html";

export default ({ mode }: ConfigEnv): UserConfig => {
    // 根据当前工作目录中的 `mode` 加载 .env 文件
	// 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
	const env = loadEnv(mode, process.cwd(), 'VITE_')
    return {
    	...
        plugins: [
			createHtmlPlugin({
				inject: {
					data: {
						...env
					},
				},
			}),
		],
        ...
    }
    
}
```

### 增加两个环境配置文件：

> 路径放在项目根目录
>
> `.env.development`
>
> `.env.development`

```
// .env.development
# 系统更新日期
VITE_APP_SYSTEM_UPDATE_DATE = '2023年09月25日 22点22分'
VITE_APP_VERSION = 'V1.10.2'

VITE_APP_COMPANY_NAME = 'XXXX科技有限公司'
VITE_APP_COPYRIGHT = '© 2023'



// .env.production
VITE_APP_SYSTEM_UPDATE_DATE = '2023年09月25日 22点22分'
VITE_APP_VERSION = 'V1.10.2'


VITE_APP_COMPANY_NAME = 'XXXX科技有限公司'
VITE_APP_COPYRIGHT = '© 2023'
```

### html页面内容：

```html
...
<div class="preload__footer">
    <div> Copyright <%- VITE_APP_COPYRIGHT %> <%- VITE_APP_COMPANY_NAME %> </div>
    <div> 最后更新日期：<%- VITE_APP_SYSTEM_UPDATE_DATE %> 版本：<%- VITE_APP_VERSION %></div>
</div>
...
```

