import { useAppStore } from "./app";
import { useMenuStore } from "./menu";
import { useProcessStore } from "./process";
import { useUserStore } from "./user";
import { useParamStore } from "./param";

export function useStore() {
	const app = useAppStore();
	const menu = useMenuStore();
	const process = useProcessStore();
	const user = useUserStore();
	const param = useParamStore();

	return {
		app,
		menu,
		process,
		user,
		param
	};
}
