<script setup lang="ts" name="help">
import {computed, reactive, ref} from "vue";
import {size} from "lodash-es";
import FullScreen from '/@/modules/components/full-screen/index.vue'

const size = ref('')
const isFullScreen = ref(false)

const detailProps = reactive([
	{ prop: 'deviceType', label: '设备类型', span: 8, formatter: (val: any) => { return val } },
	{ prop: 'model', label: '设备型号', span: 8, formatter: (val: any) => { return val } },
	{ prop: 'deviceSn', label: '设备标识码', span: 8, formatter: (val: any) => { return val } },
	{ prop: 'sapNum', label: 'SAP序列号', span: 8, formatter: (val: any) => { return val } },
	{ prop: 'scale', label: '硬度标尺', span: 8, formatter: (val: any) => { return val } },
	{ prop: 'probe', label: '探头', span: 8, formatter: (val: any) => { return val } },
	{ prop: 'probeType', label: '探头类型', span: 8, formatter: (val: any) => { return val } },
	{ prop: 'scope', label: '测量类型', span: 8, formatter: (val: any) => { return val } },
	{ prop: 'material', label: '材料', span: 8, formatter: (val: any) => { return val } },
	{ prop: 'direction', label: '冲击方向', span: 8, formatter: (val: any) => { return val } },
	{ prop: 'directionCh', label: '测量方向', span: 8, formatter: (val: any) => { return val } }, // 测厚里 只有B扫才有，所以不显示
	{ prop: 'targetUnit', label: '制式', span: 8, formatter: (val: any) => { return val } },
	{ prop: 'loginName', label: '客户账号', span: 8, formatter: (val: any) => { return val } },
	{ prop: 'createTime', label: '创建时间', span: 8, formatter: (val: any) => { return val } },
	{ prop: 'uploadTime', label: '上传时间', span: 8, formatter: (val: any) => { return val } }
])

const detailData = reactive({
	deviceType: '33333333333',
	model: '33333333333',
	deviceSn: '33333333333',
	sapNum: '33333333333',
	scale: '33333333333',
	probe: '33333333333',
	probeType: '33333333333',
	scope: '33333333333',
	material: '33333333333',
	direction: '33333333333',
	directionCh: '33333333333',
	targetUnit: '33333333333',
	loginName: '33333333333',
	createTime: '33333333333',
	uploadTime: '33333333333',
})

const iconStyle = computed(() => {
	const marginMap = {
		large: '8px',
		default: '6px',
		small: '4px',
	}
	return {
		marginRight: marginMap[size.value] || marginMap.default,
	}
})
</script>

<template>
	<div style="position: relative;outline: 1px solid red;">
		<div v-show="!isFullScreen">
			<div>帮助文档</div>
			<br>

			<hr>
			<br>
			<hr>
			<el-descriptions
				class="margin-top"
				title="With border"
				:column="3"
				:size="size"
				border
			>
				<template #extra>
					<el-button type="primary" @click="() => { isFullScreen = !isFullScreen }">详情</el-button>
				</template>
				<el-descriptions-item>
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<user />
							</el-icon>
							Username
						</div>
					</template>
					kooriookami
				</el-descriptions-item>
				<el-descriptions-item>
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<iphone />
							</el-icon>
							Telephone
						</div>
					</template>
					18100000000
				</el-descriptions-item>
				<el-descriptions-item>
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<location />
							</el-icon>
							Place
						</div>
					</template>
					Suzhou
				</el-descriptions-item>
				<el-descriptions-item>
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<tickets />
							</el-icon>
							Remarks
						</div>
					</template>
					<el-tag size="small">School</el-tag>
				</el-descriptions-item>
				<el-descriptions-item>
					<template #label>
						<div class="cell-item">
							<el-icon :style="iconStyle">
								<office-building />
							</el-icon>
							Address
						</div>
					</template>
					No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
				</el-descriptions-item>
			</el-descriptions>
		</div>

		<full-screen
			v-if="isFullScreen"
			:show-full-screen="isFullScreen"
			:back-page="() => { isFullScreen = false }"
			full-screen-name="查看信号特征详情"
			style="background-color: white;height: calc(100vh - 111px);"
		>
			<el-descriptions
				class="margin-top"
				title=""
				:column="3"
				:size="size"
				border
				style="margin: 20px;"
			>
				<el-descriptions-item v-for="(item, idx) in detailProps" :key="idx">
					<template #label>
						<div class="cell-item">{{ item.label }}</div>
					</template>
					<div>
						<span v-if="!item?.formatter">{{ detailData[item.prop] }}</span>
						<span v-else>{{ item?.formatter(detailData[item.prop]) }}</span>
					</div>
				</el-descriptions-item>
			</el-descriptions>
		</full-screen>
	</div>
</template>

<style scoped lang="scss">
.el-descriptions {
	margin-top: 20px;
}
.cell-item {
	display: flex;
	align-items: center;
}
.margin-top {
	margin-top: 20px;
}
</style>
