<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-filter-group class="signal-filter-group" :items="items" :data="formData" reset-btn></cl-filter-group>
		</cl-row>
		<cl-row>
			<!-- 新增按钮 -->
			<cl-add-btn />
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
		</cl-row>

		<cl-row>
			<!-- 数据表格 -->
			<cl-table ref="Table" height="calc(100vh - 430px)" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert">
			<template #slot-test="{ scope }">
				<!--<el-input :ref="setRefs('test')" v-model="scope.name" />-->
				<el-button @click="test">测试{{scope.name}}</el-button>
			</template>
		</cl-upsert>
	</cl-crud>
</template>

<script lang="ts" name="signal-list" setup>
import {useCrud, useTable, useUpsert} from "@cool-vue/crud";
import {useCool} from "/@/cool";
import {reactive, ref} from "vue";
import {useDict} from "/$/dict";
import dayjs from "dayjs";
import {ElMessage} from "element-plus";
import {Document} from "@element-plus/icons-vue";
import Papa from "papaparse";

const { dict } = useDict();
const { refs, setRefs, service } = useCool();

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
				filterable: true,
				// onChange(gunType) {
				// 	console.log('======>', gunType)
				// 	Crud.value?.refresh({ gunType, page: 1 });
				// }
				// onChange(gunType) {
				// 	console.log('===>', gunType)
				// 	console.log('Form.value===>', Form.value)
				// 	if (gunType === '') {
				// 		gunType = undefined
				// 	}
				// }
				// on: {
				// 	clear: (a: any, b: any, c: any) => {
				// 		console.log('=====>', a, b, c)
				// 	}
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
		label: "备注1",
		prop: "remark1",
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
		label: "备注2",
		prop: "remark2",
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
		label: "备注3",
		prop: "remark3",
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
		label: "备注4",
		prop: "remark4",
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
		label: "备注5",
		prop: "remark5",
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
		label: "备注6",
		prop: "remark6",
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
		label: "备注7",
		prop: "remark7",
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
]);

// cl-table
const Table = useTable({
	columns: [
		{
			type: "selection",
			width: 60
		},
		{
			label: "文件编号",
			prop: "fileCode",
			minWidth: 150
		},
		{
			label: "Q型",
			prop: "gunType",
			dict: dict.get("GunType"),
			minWidth: 180
		},
		{
			label: "Q编号",
			prop: "gunCode",
			dict: dict.get("GunCode"),
			minWidth: 100
		},
		{
			label: "Q寿命",
			prop: "gunLifespan",
			dict: dict.get("GunLifespan"),
			minWidth: 100
		},
		{
			label: "外挂",
			prop: "externalPlugIn",
			dict: dict.get("ExternalPlugIn"),
			minWidth: 100
		},
		{
			label: "信号源",
			prop: "signalSource",
			dict: dict.get("SignalSource"),
			minWidth: 150
		},
		{
			label: "安装位置",
			prop: "installPosition",
			dict: dict.get("InstallPosition"),
			minWidth: 120
		},
		{
			label: "安装方向",
			prop: "installDirection",
			dict: dict.get("InstallDirection"),
			minWidth: 120
		},
		{
			label: "连接方式",
			prop: "connectionMethod",
			dict: dict.get("ConnectionMethod"),
			minWidth: 100
		},
		{
			label: "动作",
			prop: "action",
			dict: dict.get("Action"),
			minWidth: 150
		},
		{
			label: "孔径",
			prop: "aperture",
			dict: dict.get("Aperture"),
			minWidth: 100
		},
		{
			label: "射弹数量",
			prop: "firedNumber",
			formatter: (row, column, val) => {
				const result = dict.get("FiredNumber").value.find((element) => {
					// 不能使用 ===, 存在 30 和 '30' 这种情况
					return element.value == val
				})
				return result?.label
			},
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
			label: "备注1",
			prop: "remark1",
			dict: dict.get("Remark1"),
			minWidth: 120
		},


		{
			label: "备注2",
			prop: "remark2",
			dict: dict.get("Remark2"),
			minWidth: 120
		},
		{
			label: "备注3",
			prop: "remark3",
			dict: dict.get("Remark3"),
			minWidth: 120
		},
		{
			label: "备注4",
			prop: "remark4",
			dict: dict.get("Remark4"),
			minWidth: 120
		},
		{
			label: "备注5",
			prop: "remark5",
			dict: dict.get("Remark5"),
			minWidth: 120
		},
		{
			label: "备注6",
			prop: "remark6",
			dict: dict.get("Remark6"),
			minWidth: 120
		},
		{
			label: "备注7",
			prop: "remark7",
			dict: dict.get("Remark7"),
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
			buttons: ["info", "edit", "delete"]
		}
	]
});

// cl-upsert
const Upsert = useUpsert({
	dialog: {
		width: "720px",
		top: 'calc((100vh - 740px) / 2)'
	},
	items: [
		{
			label: "文件编号",
			prop: "fileCode",
			value: dayjs().format("YYMMDD") + '0001',
			required: true,
			span: 12,
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
			label: "备注1",
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
			label: "备注2",
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
			label: "备注3",
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
			label: "备注4",
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
			label: "备注5",
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
			label: "备注6",
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
			label: "备注7",
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
		{
			prop: "csvFile",
			label: "信号特征数据",
			component: {
				name: "cl-upload",
				props: {
					icon: Document,
					type: "file",
					accept: "text/csv",
					limit: 1,
					limitSize: 10,
					customClass: "upload-oscilloscope-file",
					ref: setRefs('uploadOscilloscopeFileRef'),
					beforeUpload: (file: any, item: any) => {
						console.log('文件上传前校验===>', file, item)
						ElMessage.warning("文件检测中");
						Upsert.value?.showLoading()
						return csvFileToJson(file)
					},
				}
			}
		},
		{
			prop: "data",
			label: "", // 示波器csv文件，转为json后存储在data字段中
			hidden: true
		},
		{
			prop: "test",
			label: "测试", // 示波器csv文件，转为json后存储在data字段中
			component: {
				name: "slot-test",
				// name: "el-button",
				// vm: "el-button"
			}
		}
	],
	async onSubmit(data, { done, close, next }) {
		console.log('提交的数据===>', data)
		console.log('提交的回调===>', done, close, next)

		setTimeout(() => {
			next({
				...data,
				data: Upsert.value?.form.data
			});
			console.log('Upsert=========>', Upsert)
		}, 3000)

		// done 关闭加载状态
		// close 关闭弹窗
	}
});

function csvFileToJson(file: any) {
	const papaparseConfig = {
		delimiter: ":",
		header: false,
		dynamicTyping: false,
		skipEmptyLines: false,
		preview: 0,
		encoding: "",
		worker: false,
		comments: "",
		download: false,
		complete: (res: any) => {
			// UTF8 \r\n与\n混用时有可能会出问题
			let data = res.data;
			if (data[data.length - 1] == "") {
				//去除最后的空行
				data.pop();
			}
			console.log('data就是文件里面的数据====>', data);  // data就是文件里面的数据
			Upsert.value?.setForm('data', data)
			Upsert.value?.setData('data', data)
			Upsert.value?.hideLoading()
			console.log('data json是否存储成功=======>', Upsert.value?.form)
			return new Promise((resolve) => {
				ElMessage.success("示波器csv文件转为json完成！");
				resolve(true);
			});
		}
	}
	Papa.parse(file, papaparseConfig);
}

function test() {
	console.log('uploadOscilloscopeFileRef===========>', refs.uploadOscilloscopeFileRef)
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
.upload-oscilloscope-file>.cl-upload--file>.cl-upload__list {
	height: 32px;

	>.is-drag {
		height: 32px;
		width:100%;

		>.el-upload--text {
			height: 32px;
			width: 100%;

			>.cl-upload__item {
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
