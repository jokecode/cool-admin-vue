<template>
	<div v-if="showFullScreen">
		<div class="fs-main">
			<el-row :gutter="10" style="align-items: center;">
				<el-col :span="12">
					<div class="fs-title">
						<div class="fs-divider"/>
						<span>{{ fullScreenName }}</span>
					</div>
				</el-col>
				<el-col :span="12" style="text-align: right;">
					<div class="fs-btn">
						<!--返回上一页-->
						<el-button class="close-btn" type="info" @click="backPage(false)">
							<cl-svg name="icon-back" style="color: white;margin-right: 5px;"/>
							返回上一页
						</el-button>
					</div>
				</el-col>
			</el-row>
		</div>
		<div v-if="showDivider" class="fs-h-divider"/>
		<div class="fs-content">
			<slot/>
		</div>
	</div>
</template>

<script lang="ts" name="full-screen" setup>
const props = defineProps({
	showFullScreen: {
		type: Boolean,
		default: true
	},
	fullScreenName: {
		type: String,
		default: ''
	},
	showDivider: {
		type: Boolean,
		default: true
	},
	backPage: {
		type: Function,
		required: true
	}
});
</script>

<style scoped>
.fs-main {
	padding: 4px 10px;
}

.fs-divider {
	display: inline-block;
	width: 10px;
	height: 26px;
	margin-right: 8px;
	vertical-align: middle;
	position: relative;
	background-color: #1B64F1;
}

.fs-title {
	line-height: 26px;
	font-size: 16px;
	font-weight: bold;
}

.fs-h-divider {
	height: 5px;
	background-color: #F7F6F9;
}

.close-btn {
	background-color: #e6a23c;
	border-color: #E6A23C;
	color: white;
}

.close-btn:hover {
	background-color: #f69d22;
	border-color: #f69d22;
	color: whitesmoke;
}
</style>
