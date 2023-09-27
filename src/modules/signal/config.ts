import {ModuleConfig} from "/@/cool";
import { useStore } from "/@/modules/base/store";

export default (): ModuleConfig => {
	return {
		onLoad({ hasToken }) {
			const { param } = useStore();
			hasToken(() => {
				param.refresh();
			});
		}
	};
};
