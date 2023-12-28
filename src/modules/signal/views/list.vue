<template>
	<cl-crud v-show="!isFullScreen && !showImageComparison" v-visibility="{ show: !isFullScreen && !showImageComparison }" ref="Crud">
		<cl-row>
			<cl-filter-group class="signal-filter-group" :items="items" :data="formData" :on-search="queryData" reset-btn></cl-filter-group>
		</cl-row>
		<cl-row>
			<!--<el-button @click="collapseAndUnfold">收起{{isCollapse}}{{ isCollapse ? '展开' : '收起' }}</el-button>-->
			<!-- 新增按钮 -->
			<cl-add-btn/>
			<!--&lt;!&ndash; 刷新按钮 &ndash;&gt;-->
			<!--<cl-refresh-btn />-->
			<!--&lt;!&ndash; 删除按钮 &ndash;&gt;-->
			<!--<cl-multi-delete-btn />-->
			<!--&lt;!&ndash; 登录方式 &ndash;&gt;-->
			<!--<cl-filter label="登录方式">-->
			<!--	<cl-select :options="options.loginType" prop="loginType" style="width: 120px" />-->
			<!--</cl-filter>-->
			<!--&lt;!&ndash; 性别 &ndash;&gt;-->
			<!--<cl-filter label="性别">-->
			<!--	<cl-select :options="options.gender" prop="gender" style="width: 120px" />-->
			<!--</cl-filter>-->
			<!--<cl-flex1 />-->
			<!--&lt;!&ndash; 关键字搜索 &ndash;&gt;-->
			<!--<cl-search-key placeholder="搜索昵称、手机号" />-->
			<cl-flex1/>
			<!-- 图像对比 -->
			<el-button v-permission="service.signal.feature.permission.imageComparison" type="primary" @click="imageComparison">
				图像对比
			</el-button>
			<!-- 示波器导入模板下载 -->
			<el-button v-permission="service.signal.feature.permission.downloadTemplate" type="success" @click="downloadTemplate">
				示波器导入模板下载
			</el-button>
			<!-- 自定义列 -->
			<cl-column-custom v-permission="service.signal.feature.permission.customColumns" :columns="Table?.columns || []"/>
		</cl-row>

		<cl-row>
			<!-- 数据表格 -->
			<cl-table ref="Table" height="calc(100vh - 430px)"/>
		</cl-row>

		<cl-row>
			<cl-flex1/>
			<!-- 分页控件 -->
			<cl-pagination/>
		</cl-row>
		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert">
			<template #slot-el-upload="{ scope }">
				<el-upload
					ref="oscFileElUploadRef"
					:key="Math.random()"
					:file-list="fileList"
					:auto-upload="false"
					:on-change="handleChange"
					:on-preview="handlePreview"
					:on-remove="handleRemove"
					:before-remove="beforeRemove"
					:limit="1"
					:on-exceed="handleExceed"
				>
					<!--:http-request="handleRequest"-->
					<template #trigger>
						<el-button type="primary" icon="el-icon-upload">上传示波器csv文件</el-button>
					</template>

					<template #tip>
						<div class="el-upload__tip">
							提示：文件大小限制10M，文件类型.csv
						</div>
					</template>
				</el-upload>
			</template>
		</cl-upsert>
	</cl-crud>

	<!-- 信号特征详情 -->
	<full-screen
		v-if="isFullScreen"
		:show-full-screen="isFullScreen"
		:back-page="() => { isFullScreen = false }"
		full-screen-name="查看信号特征详情"
		style="background-color: white;height: calc(100vh - 111px);"
	>
		<detail :detail-data="detailData"></detail>
	</full-screen>

	<!-- 信号特征 图像对比 -->
	<full-screen
		v-if="showImageComparison"
		:show-full-screen="showImageComparison"
		:back-page="() => { showImageComparison = false }"
		full-screen-name="信号特征对比"
		style="background-color: white;height: calc(100vh - 111px);"
	>
		<comparison v-if="showImageComparison" :detail-data-list="detailDataList"></comparison>
	</full-screen>
</template>

<script lang="ts" name="signal-list" setup>
import {useCrud, useTable, useUpsert} from "@cool-vue/crud";
import {useCool} from "/@/cool";
import {computed, reactive, ref} from "vue";
import {useDict} from "/$/dict";
import dayjs from "dayjs";
import {ElMessage, ElMessageBox, UploadProps, UploadUserFile} from "element-plus";
import type {UploadInstance} from 'element-plus'
import {uuid, preProcessData} from "/@/cool/utils";
import {useBase} from "/$/base";
import Detail from "/@/modules/signal/views/detail.vue";
import Comparison from "/@/modules/signal/views/comparison.vue";
import FullScreen from "/$/components/full-screen/index.vue";
import {Feature} from "/$/signal/entity/feature";
import {useStore} from "/$/base/store";

const {user} = useBase();

const {dict} = useDict();
const {param} = useStore();
const {refs, setRefs, service} = useCool();

const isFullScreen = ref(false)
const detailData = reactive({})

const showImageComparison = ref(false)
const detailDataList = reactive<Feature[]>([])
// 示波器CSV el-upload 组件的Ref对象
const oscFileElUploadRef = ref<UploadInstance>()

// 存储新增/修改时上传的示波器文件对象
const uploadFile = ref<any>()

// 是否收起查询条件
// let isCollapse = ref(false);

const fileList = ref<UploadUserFile[]>([
	// {
	// 	name: 'element-plus-logo.svg',
	// 	url: 'https://element-plus.org/images/element-plus-logo.svg',
	// },
	// {
	// 	name: 'element-plus-logo2.svg',
	// 	url: 'https://element-plus.org/images/element-plus-logo.svg',
	// },
])

// 搜索条件默认值
const formData = reactive({
	// 文件编号
	fileCode: undefined,
	// Q型 默认值：QSZ92A型9毫米SQ
	gunType: undefined,
	// Q编号 默认值：#1
	gunCode: undefined,
	// Q寿命 默认值：新枪
	gunLifespan: undefined,
	// 外挂 默认值：无外挂
	externalPlugIn: undefined,
	// 信号源 默认值：电源电压
	signalSource: undefined,
	// 安装位置 默认值：枪内握把
	installPosition: undefined,
	// 安装方向 默认值：垂直枪
	installDirection: undefined,
	// 连接方式 默认值：无
	connectionMethod: undefined,
	// 动作 默认值：开枪-复进到位
	action: undefined,
	// 孔径 默认值：无区分
	aperture: undefined,
	// 射弹数量 默认值：1
	firedNumber: undefined,
	// 备注
	remark: undefined,
	// 备注1
	remark1: undefined,
	// 备注2
	remark2: undefined,
	// 备注3
	remark3: undefined,
	// 备注4
	remark4: undefined,
	// 备注5
	remark5: undefined,
	// 备注6
	remark6: undefined,
	// 备注7
	remark7: undefined,
})

// 选项，统一命名options，存放所有的下拉等其他选项列表数据
const options = reactive({
	// Q型
	gunType: getDictListByCode("GunType"),
	// Q编号
	gunCode: getDictListByCode("GunCode"),
	// Q寿命
	gunLifespan: getDictListByCode("GunLifespan"),
	// 外挂
	externalPlugIn: getDictListByCode("ExternalPlugIn"),
	// 信号源
	signalSource: getDictListByCode("SignalSource"),
	// 安装位置
	installPosition: getDictListByCode("InstallPosition"),
	// 安装方向
	installDirection: getDictListByCode("InstallDirection"),
	// 连接方式
	connectionMethod: getDictListByCode("ConnectionMethod"),
	// 动作
	action: getDictListByCode("Action"),
	// 孔径
	aperture: getDictListByCode("Aperture"),
	// 射弹数量
	firedNumber: getDictListByCode("FiredNumber"),
	// 备注1
	remark1: getDictListByCode("Remark1"),
	// 备注2
	remark2: getDictListByCode("Remark2"),
	// 备注3
	remark3: getDictListByCode("Remark3"),
	// 备注4
	remark4: getDictListByCode("Remark4"),
	// 备注5
	remark5: getDictListByCode("Remark5"),
	// 备注6
	remark6: getDictListByCode("Remark6"),
	// 备注7
	remark7: getDictListByCode("Remark7"),
});

const showLabelNames = ref<object>({
	remark1: '备注1',
	remark2: '备注2',
	remark3: '备注3',
	remark4: '备注4',
	remark5: '备注5',
	remark6: '备注6',
	remark7: '备注7',
})

// 更改预留字段的显示名称
function changeShowLabel() {
	const needChangeProps = ['remark1', 'remark2', 'remark3', 'remark4', 'remark5', 'remark6', 'remark7']
	const list: [] = param.get('list').value
	for (const item of list) {
		if (item?.keyName && needChangeProps.includes(item?.keyName)) {
			showLabelNames.value[item?.keyName] = item.name;
		}
	}
}

changeShowLabel();

function getDictListByCode(dictCode: string) {
	return dict.get(dictCode).value.sort((a, b) => {
		return a.orderNum - b.orderNum
	})
}

function formatterCellByCode(row: any, column: any, val: any, dictCode: string) {
	const list = options[dictCode] || [];

	for (let i = 0; i < list.length; i++) {
		const item = list[i];
		if (item.value == val) {
			return item?.label;
		}
	}
	return val;
}

// 筛选组件
const items = ref<ClForm.Item[]>([
	{
		label: "文件编号",
		prop: "fileCode",
		component: {
			name: "el-input",
			props: {
				clearable: false,
				'suffix-icon': "el-question-filled"
			}
		},
		props: {
			labelWidth: '100px'
		}

	},
	{
		label: "Q型",
		prop: "gunType",
		hook: {
			bind: ['empty'],
			// submit: ['empty'],
		},
		component: {
			name: "el-select",
			props: {
				clearable: true,
				filterable: true
			},
			options: options.gunType
		},
		props: {
			labelWidth: '100px'
		}

	},
	{
		label: "Q编号",
		prop: "gunCode",
		component: {
			name: "el-select",
			props: {
				clearable: true,
				filterable: true
			},
			options: options.gunCode
		},
		props: {
			labelWidth: '100px'
		}

	},
	{
		label: "Q寿命",
		prop: "gunLifespan",
		component: {
			name: "el-select",
			props: {
				clearable: true,
				filterable: true
			},
			options: options.gunLifespan
		},
		props: {
			labelWidth: '100px'
		}

	},
	{
		label: "外挂",
		prop: "externalPlugIn",
		component: {
			name: "el-select",
			props: {
				clearable: true,
				filterable: true
			},
			options: options.externalPlugIn
		},
		props: {
			labelWidth: '100px'
		}

	},
	{
		label: "信号源",
		prop: "signalSource",
		component: {
			name: "el-select",
			props: {
				clearable: true,
				filterable: true
			},
			options: options.signalSource
		},
		props: {
			labelWidth: '100px'
		}

	},
	{
		label: "安装位置",
		prop: "installPosition",
		component: {
			name: "el-select",
			props: {
				clearable: true,
				filterable: true
			},
			options: options.installPosition
		},
		props: {
			labelWidth: '100px'
		}

	},
	{
		label: "安装方向",
		prop: "installDirection",
		component: {
			name: "el-select",
			props: {
				clearable: true,
				filterable: true
			},
			options: options.installDirection
		},
		props: {
			labelWidth: '100px'
		}

	},
	{
		label: "连接方式",
		prop: "connectionMethod",
		component: {
			name: "el-select",
			props: {
				clearable: true,
				filterable: true
			},
			options: options.connectionMethod
		},
		props: {
			labelWidth: '100px'
		}

	},
	{
		label: "动作",
		prop: "action",
		component: {
			name: "el-select",
			props: {
				clearable: true,
				filterable: true
			},
			options: options.action
		},
		props: {
			labelWidth: '100px'
		}

	},
	{
		label: "孔径",
		prop: "aperture",
		component: {
			name: "el-select",
			props: {
				clearable: true,
				filterable: true
			},
			options: options.aperture
		},
		props: {
			labelWidth: '100px'
		}

	},
	{
		label: "射弹数量",
		prop: "firedNumber",
		component: {
			name: "el-select",
			props: {
				clearable: true,
				filterable: true
			},
			options: options.firedNumber
		},
		props: {
			labelWidth: '100px'
		}

	},
	{
		label: "备注",
		prop: "remark",
		component: {
			name: "el-input",
			props: {
				clearable: false,
				'suffix-icon': "el-question-filled"
			}
		},
		props: {
			labelWidth: '100px'
		}

	},
	{
		label: showLabelNames.value['remark1'],
		prop: "remark1",
		component: {
			name: "el-select",
			props: {
				clearable: true,
				filterable: true
			},
			options: options.remark1
		},
		props: {
			labelWidth: '100px'
		}

	},
	{
		label: showLabelNames.value['remark2'],
		prop: "remark2",
		component: {
			name: "el-select",
			props: {
				clearable: true,
				filterable: true
			},
			options: options.remark2
		},
		props: {
			labelWidth: '100px'
		}

	},
	{
		label: showLabelNames.value['remark3'],
		prop: "remark3",
		component: {
			name: "el-select",
			props: {
				clearable: true,
				filterable: true
			},
			options: options.remark3
		},
		props: {
			labelWidth: '100px'
		}

	},
	{
		label: showLabelNames.value['remark4'],
		prop: "remark4",
		component: {
			name: "el-select",
			props: {
				clearable: true,
				filterable: true
			},
			options: options.remark4
		},
		props: {
			labelWidth: '100px'
		}

	},
	{
		label: showLabelNames.value['remark5'],
		prop: "remark5",
		component: {
			name: "el-select",
			props: {
				clearable: true,
				filterable: true
			},
			options: options.remark5
		},
		props: {
			labelWidth: '100px'
		}

	},
	{
		label: showLabelNames.value['remark6'],
		prop: "remark6",
		component: {
			name: "el-select",
			props: {
				clearable: true,
				filterable: true
			},
			options: options.remark6
		},
		props: {
			labelWidth: '100px'
		}

	},
	{
		label: showLabelNames.value['remark7'],
		prop: "remark7",
		component: {
			name: "el-select",
			props: {
				clearable: true,
				filterable: true
			},
			options: options.remark7
		},
		props: {
			labelWidth: '100px'
		}

	},
]);

function queryData(form: any) {
	let temp = preProcessData(form)
	refresh({ ...temp, page: 1 })
}

// function collapseAndUnfold() {
// 	console.log('collapseAndUnfold', '======')
// 	const collapseCol = ['remark1', 'remark2', 'remark3', 'remark4', 'remark5', 'remark6', 'remark7']
//     if (isCollapse.value) {
//         items.value.forEach(ele => {
// 			console.log('true ========>', ele)
// 			if (collapseCol.includes(ele.prop || '')) {
// 				ele['hidden'] = true
// 			}
// 		})
// 		console.log('true items.value=========>', items.value)
// 	} else {
//         items.value.forEach(ele => {
// 			console.log('false ========>', ele)
//             if (collapseCol.includes(ele.prop || '')) {
// 				ele['hidden'] = false
//             }
//         })
// 		console.log('false items.value=========>', items.value)
// 	}
//     isCollapse.value = !isCollapse.value
// }

// cl-table
const Table = useTable({
	columns: [
		{
			type: "selection",
			width: 60,
			fixed: "left"
		},
		{
			type: "index",
			label: "序号",
			width: 55,
			fixed: "left"
		},
		{
			label: "文件编号",
			prop: "fileCode",
			minWidth: 150,
			fixed: "left"
		},
		{
			label: "Q型",
			prop: "gunType",
			formatter: (row, column, val) => {
				return formatterCellByCode(row, column, val, 'gunType')
			},
			// dict: dict.get("GunType"),
			minWidth: 180
		},
		{
			label: "Q编号",
			prop: "gunCode",
			formatter: (row, column, val) => {
				return formatterCellByCode(row, column, val, 'gunCode')
			},
			// dict: dict.get("GunCode"),
			minWidth: 100
		},
		{
			label: "Q寿命",
			prop: "gunLifespan",
			formatter: (row, column, val) => {
				return formatterCellByCode(row, column, val, 'gunLifespan')
			},
			// dict: dict.get("GunLifespan"),
			minWidth: 100
		},
		{
			label: "外挂",
			prop: "externalPlugIn",
			formatter: (row, column, val) => {
				return formatterCellByCode(row, column, val, 'externalPlugIn')
			},
			// dict: dict.get("ExternalPlugIn"),
			minWidth: 100
		},
		{
			label: "信号源",
			prop: "signalSource",
			formatter: (row, column, val) => {
				return formatterCellByCode(row, column, val, 'signalSource')
			},
			// dict: dict.get("SignalSource"),
			minWidth: 150
		},
		{
			label: "安装位置",
			prop: "installPosition",
			formatter: (row, column, val) => {
				return formatterCellByCode(row, column, val, 'installPosition')
			},
			// dict: dict.get("InstallPosition"),
			minWidth: 120
		},
		{
			label: "安装方向",
			prop: "installDirection",
			formatter: (row, column, val) => {
				return formatterCellByCode(row, column, val, 'installDirection')
			},
			// dict: dict.get("InstallDirection"),
			minWidth: 120
		},
		{
			label: "连接方式",
			prop: "connectionMethod",
			formatter: (row, column, val) => {
				return formatterCellByCode(row, column, val, 'connectionMethod')
			},
			// dict: dict.get("ConnectionMethod"),
			minWidth: 100
		},
		{
			label: "动作",
			prop: "action",
			formatter: (row, column, val) => {
				return formatterCellByCode(row, column, val, 'action')
			},
			// dict: dict.get("Action"),
			minWidth: 150
		},
		{
			label: "孔径",
			prop: "aperture",
			formatter: (row, column, val) => {
				return formatterCellByCode(row, column, val, 'aperture')
			},
			// dict: dict.get("Aperture"),
			minWidth: 100
		},
		{
			label: "射弹数量",
			prop: "firedNumber",
			formatter: (row, column, val) => {
				return formatterCellByCode(row, column, val, 'firedNumber')
			},
			// dict: dict.get("FiredNumber"),
			// dict: {
			// 	text: true,
			// 	options: dict.get("FiredNumber").value
			// },
			minWidth: 100
		},
		{
			label: "备注",
			prop: "remark",
			minWidth: 240,
			headerAlign: 'center',
			align: 'left'
		},
		{
			label: showLabelNames.value['remark1'],
			prop: "remark1",
			formatter: (row, column, val) => {
				return formatterCellByCode(row, column, val, 'remark1')
			},
			// dict: dict.get("Remark1"),
			minWidth: 120
		},


		{
			label: showLabelNames.value['remark2'],
			prop: "remark2",
			formatter: (row, column, val) => {
				return formatterCellByCode(row, column, val, 'remark2')
			},
			// dict: dict.get("Remark2"),
			minWidth: 120
		},
		{
			label: showLabelNames.value['remark3'],
			prop: "remark3",
			formatter: (row, column, val) => {
				return formatterCellByCode(row, column, val, 'remark3')
			},
			// dict: dict.get("Remark3"),
			minWidth: 120
		},
		{
			label: showLabelNames.value['remark4'],
			prop: "remark4",
			formatter: (row, column, val) => {
				return formatterCellByCode(row, column, val, 'remark4')
			},
			// dict: dict.get("Remark4"),
			minWidth: 120
		},
		{
			label: showLabelNames.value['remark5'],
			prop: "remark5",
			formatter: (row, column, val) => {
				return formatterCellByCode(row, column, val, 'remark5')
			},
			// dict: dict.get("Remark5"),
			minWidth: 120
		},
		{
			label: showLabelNames.value['remark6'],
			prop: "remark6",
			formatter: (row, column, val) => {
				return formatterCellByCode(row, column, val, 'remark6')
			},
			// dict: dict.get("Remark6"),
			minWidth: 120
		},
		{
			label: showLabelNames.value['remark7'],
			prop: "remark7",
			formatter: (row, column, val) => {
				return formatterCellByCode(row, column, val, 'remark7')
			},
			// dict: dict.get("Remark7"),
			minWidth: 120
		},
		{
			label: "创建时间",
			prop: "createTime",
			minWidth: 160
		},
		{
			label: "更新时间",
			prop: "updateTime",
			sortable: "desc",
			minWidth: 160
		},
		{
			label: "操作",
			type: "op",
			width: 230,
			buttons: [{
				label: "详情",
				type: "success",
				onClick({scope}) {
					// scope行数据
					service.signal.feature.info({id: scope.row.id}).then(res => {
						isFullScreen.value = true
						const formatterProps = ["gunType", "gunCode", "gunLifespan", "externalPlugIn", "signalSource", "installPosition", "installDirection", "connectionMethod", "action", "aperture", "firedNumber", "remark1", "remark2", "remark3", "remark4", "remark5", "remark6", "remark7",]
						for (const key in res) {
							if (formatterProps.includes(key)) {
								detailData[key] = formatterCellByCode(null, null, res[key], key);
							} else {
								detailData[key] = res[key];
							}
						}
					}).catch(err => {
						ElMessage.error(err.message);
					})
				}
			}, "edit", "delete"]
		}
	]
});

let uploadSuccessSaveData: any;


// 计算属性（dialog的add update info模式）
const dlgMode = computed(() => {
	return Upsert.value?.mode
})

// cl-upsert
const Upsert = useUpsert({
	dialog: {
		width: "720px",
		top: 'calc((100vh - 820px) / 2)',
	},
	items: [
		() => {
			return {
				label: "文件编号",
				prop: "fileCode",
				value: dayjs().format("YYMMDD") + '0001',
				required: true,
				span: 12,
				component: {
					name: "el-input",
					props: {
						clearable: false,
						'suffix-icon': "el-question-filled",
						disabled: Upsert.value?.mode === 'update'
						// ['update', 'info'].includes(Upsert.value?.mode || '')
					}
				},
				props: {
					labelWidth: '100px'
				}

			}
		},
		{
			label: "Q型",
			prop: "gunType",
			// 默认值：QSZ92A型9毫米SQ
			value: 29,
			required: true,
			span: 12,
			hook: {
				bind: ['number'], // 转成 number, 如果值是数组，那每一项都会被操作到
			},
			component: {
				name: "el-select",
				props: {
					clearable: true,
					filterable: true,
					// onChange(gunType) {
					// 	console.log('======>', gunType)
					// 	Crud.value?.refresh({ gunType, page: 1 });
					// }
				},
				options: dict.get("GunType").value.sort((a, b) => {
					return a.orderNum - b.orderNum
				})
			},
			props: {
				labelWidth: '100px'
			}

		},
		{
			label: "Q编号",
			prop: "gunCode",
			// 默认值：#1
			value: 34,
			required: true,
			span: 12,
			hook: {
				bind: ['number'],
			},
			component: {
				name: "el-select",
				props: {
					clearable: true,
					filterable: true
				},
				options: dict.get("GunCode").value.sort((a, b) => {
					return a.orderNum - b.orderNum
				})
			},
			props: {
				labelWidth: '100px'
			}

		},
		{
			label: "Q寿命",
			prop: "gunLifespan",
			// 默认值：新枪
			value: 37,
			span: 12,
			hook: {
				bind: ['number'],
			},
			component: {
				name: "el-select",
				props: {
					clearable: true,
					filterable: true
				},
				options: dict.get("GunLifespan").value.sort((a, b) => {
					return a.orderNum - b.orderNum
				})
			},
			props: {
				labelWidth: '100px'
			}

		},
		{
			label: "外挂",
			prop: "externalPlugIn",
			// 默认值：无外挂
			value: 41,
			span: 12,
			hook: {
				bind: ['number'],
			},
			component: {
				name: "el-select",
				props: {
					clearable: true,
					filterable: true
				},
				options: dict.get("ExternalPlugIn").value.sort((a, b) => {
					return a.orderNum - b.orderNum
				})
			},
			props: {
				labelWidth: '100px'
			}

		},
		{
			label: "信号源",
			prop: "signalSource",
			// 默认值：电源电压
			value: 54,
			required: true,
			span: 12,
			hook: {
				bind: ['number'],
			},
			component: {
				name: "el-select",
				props: {
					clearable: true,
					filterable: true
				},
				options: dict.get("SignalSource").value.sort((a, b) => {
					return a.orderNum - b.orderNum
				})
			},
			props: {
				labelWidth: '100px'
			}

		},
		{
			label: "安装位置",
			prop: "installPosition",
			// 默认值：枪内握把
			value: 63,
			span: 12,
			hook: {
				bind: ['number'],
			},
			component: {
				name: "el-select",
				props: {
					clearable: true,
					filterable: true
				},
				options: dict.get("InstallPosition").value.sort((a, b) => {
					return a.orderNum - b.orderNum
				})
			},
			props: {
				labelWidth: '100px'
			}

		},
		{
			label: "安装方向",
			prop: "installDirection",
			// 默认值：垂直枪
			value: 65,
			span: 12,
			hook: {
				bind: ['number'],
			},
			component: {
				name: "el-select",
				props: {
					clearable: true,
					filterable: true
				},
				options: dict.get("InstallDirection").value.sort((a, b) => {
					return a.orderNum - b.orderNum
				})
			},
			props: {
				labelWidth: '100px'
			}

		},
		{
			label: "连接方式",
			prop: "connectionMethod",
			// 默认值：无
			value: 70,
			span: 12,
			hook: {
				bind: ['number'],
			},
			component: {
				name: "el-select",
				props: {
					clearable: true,
					filterable: true
				},
				options: dict.get("ConnectionMethod").value.sort((a, b) => {
					return a.orderNum - b.orderNum
				})
			},
			props: {
				labelWidth: '100px'
			}

		},
		{
			label: "动作",
			prop: "action",
			// 默认值：开枪-复进到位
			value: 75,
			span: 12,
			hook: {
				bind: ['number'],
			},
			component: {
				name: "el-select",
				props: {
					clearable: true,
					filterable: true
				},
				options: dict.get("Action").value.sort((a, b) => {
					return a.orderNum - b.orderNum
				})
			},
			props: {
				labelWidth: '100px'
			}

		},
		{
			label: "孔径",
			prop: "aperture",
			// 默认值：无区分
			value: 81,
			span: 12,
			hook: {
				bind: ['number'],
			},
			component: {
				name: "el-select",
				props: {
					clearable: true,
					filterable: true
				},
				options: dict.get("Aperture").value.sort((a, b) => {
					return a.orderNum - b.orderNum
				})
			},
			props: {
				labelWidth: '100px'
			}

		},
		{
			label: "射弹数量",
			prop: "firedNumber",
			// 默认值：1
			value: 83,
			span: 12,
			hook: {
				bind: ['number'],
			},
			component: {
				name: "el-select",
				props: {
					clearable: true,
					filterable: true
				},
				options: dict.get("FiredNumber").value.sort((a, b) => {
					return a.orderNum - b.orderNum
				})
			},
			props: {
				labelWidth: '100px'
			}

		},
		{
			label: "备注",
			prop: "remark",
			span: 24,
			component: {
				name: "el-input",
				props: {
					clearable: false,
					type: 'textarea',
					'suffix-icon': "el-question-filled"
				}
			},
			props: {
				labelWidth: '100px'
			}

		},
		{
			label: showLabelNames.value['remark1'],
			prop: "remark1",
			span: 12,
			hook: {
				bind: ['number'],
			},
			component: {
				name: "el-select",
				props: {
					clearable: true,
					filterable: true
				},
				options: dict.get("Remark1").value.sort((a, b) => {
					return a.orderNum - b.orderNum
				})
			},
			props: {
				labelWidth: '100px'
			}

		},
		{
			label: showLabelNames.value['remark2'],
			prop: "remark2",
			span: 12,
			hook: {
				bind: ['number'],
			},
			component: {
				name: "el-select",
				props: {
					clearable: true,
					filterable: true
				},
				options: dict.get("Remark2").value.sort((a, b) => {
					return a.orderNum - b.orderNum
				})
			},
			props: {
				labelWidth: '100px'
			}

		},
		{
			label: showLabelNames.value['remark3'],
			prop: "remark3",
			span: 12,
			hook: {
				bind: ['number'],
			},
			component: {
				name: "el-select",
				props: {
					clearable: true,
					filterable: true
				},
				options: dict.get("Remark3").value.sort((a, b) => {
					return a.orderNum - b.orderNum
				})
			},
			props: {
				labelWidth: '100px'
			}

		},
		{
			label: showLabelNames.value['remark4'],
			prop: "remark4",
			span: 12,
			hook: {
				bind: ['number'],
			},
			component: {
				name: "el-select",
				props: {
					clearable: true,
					filterable: true
				},
				options: dict.get("Remark4").value.sort((a, b) => {
					return a.orderNum - b.orderNum
				})
			},
			props: {
				labelWidth: '100px'
			}

		},
		{
			label: showLabelNames.value['remark5'],
			prop: "remark5",
			span: 12,
			hook: {
				bind: ['number'],
			},
			component: {
				name: "el-select",
				props: {
					clearable: true,
					filterable: true
				},
				options: dict.get("Remark5").value.sort((a, b) => {
					return a.orderNum - b.orderNum
				})
			},
			props: {
				labelWidth: '100px'
			}

		},
		{
			label: showLabelNames.value['remark6'],
			prop: "remark6",
			span: 12,
			hook: {
				bind: ['number'],
			},
			component: {
				name: "el-select",
				props: {
					clearable: true,
					filterable: true
				},
				options: dict.get("Remark6").value.sort((a, b) => {
					return a.orderNum - b.orderNum
				})
			},
			props: {
				labelWidth: '100px'
			}

		},
		{
			label: showLabelNames.value['remark7'],
			prop: "remark7",
			span: 12,
			hook: {
				bind: ['number'],
			},
			component: {
				name: "el-select",
				props: {
					clearable: true,
					filterable: true
				},
				options: dict.get("Remark7").value.sort((a, b) => {
					return a.orderNum - b.orderNum
				})
			},
			props: {
				labelWidth: '100px'
			}

		},
		// 示波器csv文件，转为json后存储在data字段中
		{
			prop: "testElUpload",
			label: "信号特征数据", // 示波器csv文件，转为json后存储在data字段中
			component: {
				name: "slot-el-upload",
			}
		},
		{
			prop: "data",
			label: "示波器数据",
			hidden: true
		},
		// 示波器csv文件，在数据库中的文件id
		{
			prop: "attachmentId",
			label: "CSV文件ID",
			hidden: true
		},
		// 示波器csv文件的原始名称
		{
			prop: "attachmentName",
			label: "",
			hidden: true
		},
		// 示波器csv文件的下载url
		{
			prop: "attachmentPath",
			label: "CSV文件URL",
			hidden: true
		},
		// 示波器csv文件
		{
			prop: "uploadFile",
			label: "示波器csv文件",
			hidden: true
		},
	],
	async onSubmit(data, {done, close}) {
		const fd = new FormData();
		// 信号特征 数据
		for (const i in Upsert?.value?.form) {
			Upsert?.value?.form[i] && fd.append(i, Upsert?.value?.form[i]); // undefined、null和''值不传给后端
		}
		if (uploadFile.value && uploadFile.value.raw) {
			// 文件名
			const fileName = uuid("") + "_" + uploadFile.value.raw.name
			// 文件大小
			fd.append("fileSize", uploadFile.value.raw.size);
			// 文件名
			fd.append("key", fileName);
			// 文件
			fd.append('file', uploadFile.value.raw, uploadFile.value.raw.name)
		}

		const mode = Upsert.value?.mode
		// 判断新增还是修改
		if (mode === 'add') {
			add(fd, done, close)
		} else if (mode === 'update') {
			update(fd, done, close)
		}
	},
	onOpen(data) {
		if (['info', 'update', 'add'].includes(Upsert.value?.mode || '')) {
			if (data.attachmentId) {
				fileList.value = [
					{
						name: data.attachmentName,
						url: data.attachmentPath,
					}
				]
			} else {
				removeAttInfo()
			}
		} else {
			removeAttInfo()
		}
	}
});

function add(fd: any, done: () => void, close: () => void) {
	// 自定义发送请求
	service.signal.feature.request({
		url: "/add",
		headers: {'Content-Type': 'multipart/form-data'},
		method: "POST",
		data: fd,
	}).then(() => {
		ElMessageBox.confirm("新增成功，是否继续新增？", "提示", {
			type: "warning"
		}).then(() => {
			done();
			// 第一次录入数据时默认初始值选项，第二录入数据时则是用上一次录入的记录；
			// 例如文件编号初始2310200001，当第一次录入2310090001 第二次点击上传则是在上一次的历史2310090001上修改为2310090002
			const fileCode = Upsert?.value?.form?.fileCode;
			const nextFileCode = autoAddFileCode(fileCode)
			if (nextFileCode) {
				Upsert.value?.setForm('fileCode', nextFileCode);
			} else {
				ElMessage.warning({
					duration: 5000,
					message: '文件编号异常，请自行修改！'
				});
			}
		}).catch(() => {
			done(); // 关闭加载状态
			close(); // 关闭弹窗
		});
		ElMessage.success('新增成功！');
		// 操作完，刷新列表
		refresh();
	}).catch(err => {
		console.error('add res ===>', err)
		ElMessage.error(err.message);
		done();
	})
}

// 文件编号自增（需考虑2312280001_001、2312280001这两种编号的自增情况）
function autoAddFileCode(fileCode: String) {
	if (!fileCode || fileCode.length <= 6) {
		return false
	}
	let result;
	let splitArr = fileCode.split('');
	let strIndex = [5]; // 2312280001 文件编号前六位是日期不参与自增，
	for (let i = 0; i < splitArr.length; i++) {
		const item = splitArr[i];
		if (isNaN(Number(item))) {
			strIndex.push(i)
		}
	}
	let startIndex = strIndex[strIndex.length-1] + 1;
	// 防止用户在前6位编号中塞入字符串
	if (startIndex < 5) {
		return false
	}
	let autoAddNum = fileCode.substring(startIndex, fileCode.length)
	console.log('截取到的自增字符串==>', autoAddNum)
	result = `${fileCode.substring(0, startIndex)}${String(Number(autoAddNum)+1).padStart(autoAddNum.length, '0')}`
	console.log('文件编号自增结果==>', result)
	return result;
}

function update(fd: any, done: () => void, close: () => void) {
	service.signal.feature.request({
		url: "/update",
		headers: {'Content-Type': 'multipart/form-data'},
		method: "POST",
		data: fd,
	}).then(() => {
		ElMessage.success('修改成功');
		// 操作完，刷新列表
		refresh();
		done(); // 关闭加载状态
		close(); // 关闭弹窗
	}).catch(err => {
		ElMessage.error(err.message);
		done();
	})
}

function removeAttInfo() {
	uploadFile.value = null;
	Upsert.value?.setForm('data', null);
	Upsert.value?.setForm('attachmentId', null);
	Upsert.value?.setForm('attachmentName', null);
	Upsert.value?.setForm('attachmentPath', null);

	Upsert.value?.setData('data', null);
	Upsert.value?.setData('attachmentId', null);
	Upsert.value?.setData('attachmentName', null);
	Upsert.value?.setData('attachmentPath', null);
	oscFileElUploadRef.value?.clearFiles();
}

const handleChange: UploadProps['onChange'] = (file, uploadFiles) => {
	console.log('handleChange', file, uploadFiles);
	if (file.status === 'ready') {
		uploadFile.value = file;
	}
}

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
	Upsert.value?.showLoading();
	console.log('handleRemove', file, uploadFiles);
	removeAttInfo();
	Upsert.value?.hideLoading();
}

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
	console.log('handlePreview', uploadFile);
	if (['info', 'update'].includes(dlgMode.value || '')) {
		const url = uploadFile?.url
		const link = document.createElement("a");
		link.setAttribute("href", url || "#");
		// let fileName = url?.split('/').pop();
		// let temp = fileName?.split('.')
		// temp?.pop();
		// let downloadName = temp?.join('.')
		// 注意：只有 Firefox 和 Chrome 支持 download 属性。href的属性地址必须是和你前端同源情况下download才会起作用，如果涉及跨域情况下，download将不会起作用
		// TODO: 如果涉及跨域问题，可以采用axios获取文件流下载文件
		// Axios.get(url,{responseType:'blob'}).then(res=>{
		// 	const blob = new Blob([res.data])
		// 	let a = document.createElement('a')
		// 	a.href=URL.createObjectURL(blob)
		// 	a.download = fileName
		// 	a.click()
		// })
		// link.setAttribute("download", downloadName?.split('_').pop() || "");
		link.setAttribute("download", "");
		link.click();
	}
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
	ElMessage.warning(`最多只能上传 ${files.length} 个csv文件, 但是你上传了 ${files.length + uploadFiles.length} 个文件`)
}

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
	console.log('beforeRemove =====>', uploadFile, uploadFiles)
	return ElMessageBox.confirm(
		`取消上传文件： ${uploadFile.name} ?`
	).then(
		() => true,
		() => false
	)
}

// 文件上传请求
const handleRequest: UploadProps['httpRequest'] = async (req: any, item?: any) => {
	try {
		// 文件id
		const fileId = uuid("");
		// 文件名
		let fileName = fileId + "_" + req.file.name;

		const fd = new FormData();
		// 文件名
		fd.append("key", fileName);
		// 文件
		fd.append("file", req.file);

		// 上传
		await service
			.request({
				// url: "/admin/base/comm/upload",
				url: "/admin/base/comm/uploadOscCsv",
				method: "POST",
				headers: {
					"Authorization": user.token,
					"Content-Type": "multipart/form-data"
				},
				timeout: 600000,
				data: fd,
				// onUploadProgress(e: { loaded: number; total: number }) {
				// 	item.progress = parseInt(String((e.loaded / e.total) * 100));
				// 	emit("progress", item);
				// },
				proxy: true
			})
			.then((res) => {
				console.log('service.request then res====>', res)
				const attachmentId = res?.id;
				Upsert.value?.setForm('attachmentId', attachmentId);
				Upsert.value?.setData('attachmentId', attachmentId);
				uploadSuccessSaveData().then(() => {
					Upsert.value?.hideLoading();
				}).catch(() => {
					Upsert.value?.hideLoading();
				})
			})
			.catch((err) => {
				ElMessage.error(`文件上传失败：${err.message}`);
				item.error = err.message;
			});
	} catch (e) {
		console.log('上传示波器csv失败：', e)
		ElMessage.error('上传配置错误')
	}
}

// cl-crud
const Crud = useCrud(
	{
		service: service.signal.feature
	},
	(app) => {
		app.refresh();
	}
);

// 刷新列表，统一调用这个方法去刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}

// 图像对比
function imageComparison() {
	const selection = Table.value?.getSelectionRows();
	if (!selection || selection.length <= 0) {
		ElMessage.warning('请勾选需要选择的数据！');
		return false
	}
	if (selection.length > 20) {
		ElMessage.warning('勾选的数量不允许超过20个！');
		return false
	}
	// 需要formatter的字段
	const formatterProps = [
		// Q型
		"gunType",
		// Q编号
		"gunCode",
		// Q寿命
		"gunLifespan",
		// 外挂
		"externalPlugIn",
		// 信号源
		"signalSource",
		// 安装位置
		"installPosition",
		// 安装方向
		"installDirection",
		// 连接方式
		"connectionMethod",
		// 动作
		"action",
		// 孔径
		"aperture",
		// 射弹数量
		"firedNumber",
		// 备注1
		"remark1",
		// 备注2
		"remark2",
		// 备注3
		"remark3",
		// 备注4
		"remark4",
		// 备注5
		"remark5",
		// 备注6
		"remark6",
		// 备注7
		"remark7",
	];
	detailDataList.length = 0
	for (let i = 0; i < selection.length; i++) {
		let item = selection[i];
		const detailData: Feature = new Feature();
		for (const key in item) {
			if (formatterProps.includes(key)) {
				detailData[key] = formatterCellByCode(null, null, item[key], key);
			} else {
				detailData[key] = item[key];
			}
		}
		detailData['showChart'] = true;
		detailData['chartLoading'] = false;
		detailDataList.push(detailData);
	}
	showImageComparison.value = true
}

// 示波器导入模板下载
function downloadTemplate() {
	service.signal.feature.downloadTemplate().then(res => {
		const link = document.createElement("a");
		link.setAttribute("href", res || "#");
		link.setAttribute("download", "");
		link.click();
		ElMessage.success('模板下载成功！');
	}).catch(err => {
		ElMessage.error(err.message);
	})
}
</script>

<style lang="scss" scoped>
.signal-filter-group {
	:deep(.cl-form__items:last-child > .el-form-item:last-child) {
		padding-right: 16px;
		float: right;
	}
}

</style>


<style lang="scss">
/*  自定义上传示波器文件控件的样式  */
.upload-oscilloscope-file > .cl-upload--file > .cl-upload__list {
	height: 32px;

	> .is-drag {
		height: 32px;
		width: 100%;

		> .el-upload--text {
			height: 32px;
			width: 100%;

			> .cl-upload__item {
				height: 32px;
				width: 100%;

				.cl-upload__name {
					text-align: left;
				}

				.cl-upload__actions {
					justify-content: flex-end;
				}
			}
		}
	}
}
</style>
