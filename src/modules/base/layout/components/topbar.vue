<template>
	<a-menu v-if="app.info.menu.isGroup" />

	<div class="app-topbar">
		<div
			class="app-topbar__collapse"
			:class="{
				unfold: !app.isFold
			}"
			@click="app.fold()"
		>
			<i class="cl-iconfont cl-icon-fold"></i>
		</div>

		<!-- 路由导航 -->
		<route-nav />

		<div class="flex1"></div>

		<!-- 工具栏 -->
		<ul class="app-topbar__tools">
			<auto-menu-btn v-if="config.app.showAutoMenuBtn" />

			<li v-if="config.app.showClChat">
				<cl-chat />
			</li>

			<li v-if="config.app.showClTheme">
				<cl-theme />
			</li>
		</ul>

		<!-- 用户信息 -->
		<div class="app-topbar__user" v-if="user.info">
			<el-dropdown trigger="click" hide-on-click @command="onCommand">
				<span class="el-dropdown-link">
					<span class="name">{{ user.info.nickName }}</span>
					<cl-avatar :size="32" :src="user.info.headImg" />
				</span>

				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item command="my">
							<i class="cl-iconfont cl-icon-user"></i>
							<span>个人中心</span>
						</el-dropdown-item>
						<el-dropdown-item command="exit">
							<i class="cl-iconfont cl-icon-exit"></i>
							<span>退出</span>
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</div>
</template>

<script lang="ts" name="app-topbar" setup>
import { useBase } from "/$/base";
import { useCool } from "/@/cool";
import RouteNav from "./route-nav.vue";
import AMenu from "./amenu.vue";
import AutoMenuBtn from "/$/magic/components/auto-menu/btn.vue";

const { router, service } = useCool();
const { user, app } = useBase();
import { config } from "/@/cool/config/index.ts";

async function onCommand(name: string) {
	switch (name) {
		case "my":
			router.push("/my/info");
			break;
		case "exit":
			await service.base.comm.logout();
			user.logout();
			break;
	}
}
</script>

<style lang="scss" scoped>
.app-topbar {
	display: flex;
	align-items: center;
	height: 50px;
	padding: 0 10px;
	background-color: #fff;
	margin-bottom: 10px;

	&__collapse {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 40px;
		width: 40px;
		cursor: pointer;
		transform: rotateY(180deg);

		&.unfold {
			transform: rotateY(0);
		}

		i {
			font-size: 20px;
		}
	}

	.flex1 {
		flex: 1;
	}

	&__tools {
		display: flex;
		margin-right: 20px;

		& > li {
			display: flex;
			justify-content: center;
			align-items: center;
			list-style: none;
			height: 45px;
			min-width: 45px;
			border-radius: 3px;
			cursor: pointer;
			margin-left: 10px;
		}
	}

	&__user {
		margin-right: 10px;
		cursor: pointer;

		.el-dropdown-link {
			display: flex;
			align-items: center;
		}

		.name {
			white-space: nowrap;
			margin-right: 15px;
		}

		.el-icon-arrow-down {
			margin-left: 10px;
		}
	}
}
</style>
