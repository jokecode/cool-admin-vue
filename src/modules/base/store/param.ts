import { defineStore } from "pinia";
import { computed, reactive, toRaw } from "vue";
import { isDev, service } from "/@/cool";

const useParamStore = defineStore("param", () => {
	// 对象数据
	const data = reactive<object>({});

	// 获取
	function get(name: string) {
		return computed(() => data[name]);
	}

	// 刷新
	async function refresh() {
		return service.base.sys.param.list().then((res: object) => {
			Object.assign(data, {list: res});

			if (isDev) {
				console.group("参数列表");
				console.log(toRaw(data));
				console.log('src/modules/base/store/param.ts refresh=====>', res)
				console.groupEnd();
			}

			return data;
		});
	}

	return {
		data,
		get,
		refresh
	};
});

export { useParamStore };
