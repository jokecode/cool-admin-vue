<script setup lang="ts" name="feature-detail">
import {nextTick, onMounted, reactive, ref} from "vue";
import * as echarts from "echarts";
import ContentDivider from '/@/modules/components/content-divider/index.vue'
import {useCool} from "/@/cool";
import {ElMessage} from "element-plus";
import {useStore} from "/$/base/store";
const {param} = useStore();

const {service} = useCool();
const props = defineProps({
	detailData: {
		type: Object,
		default: () => {
			return {}
		}
	},
});

const detailProps = reactive([
	{prop: 'fileCode', label: '文件编号', span: 8},
	{prop: 'gunType', label: 'Q型', span: 8},
	{prop: 'gunCode', label: 'Q编号', span: 8},
	{prop: 'gunLifespan', label: 'Q寿命', span: 8},
	{prop: 'externalPlugIn', label: '外挂', span: 8},
	{prop: 'signalSource', label: '信号源', span: 8},
	{prop: 'installPosition', label: '安装位置', span: 8},
	{prop: 'installDirection', label: '安装方向', span: 8},
	{prop: 'connectionMethod', label: '连接方式', span: 8},
	{prop: 'action', label: '动作', span: 8},
	{prop: 'aperture', label: '孔径', span: 8},
	{prop: 'firedNumber', label: '射弹数量', span: 8},
	{prop: 'remark', label: '备注', span: 8},
	{prop: 'remark1', label: '备注1', span: 8},
	{prop: 'remark2', label: '备注2', span: 8},
	{prop: 'remark3', label: '备注3', span: 8},
	{prop: 'remark4', label: '备注4', span: 8},
	{prop: 'remark5', label: '备注5', span: 8},
	{prop: 'remark6', label: '备注6', span: 8},
	{prop: 'remark7', label: '备注7', span: 8},
	{prop: 'createTime', label: '创建时间', span: 8},
	{prop: 'updateTime', label: '更新时间', span: 8},
	{prop: 'attachmentPath', label: '信号特征数据', span: 16},

	// { prop: 'deviceType', label: '设备类型', span: 8, formatter: (val: any) => { return val } },
	// { prop: 'model', label: '设备型号', span: 8, formatter: (val: any) => { return val } },
	// { prop: 'deviceSn', label: '设备标识码', span: 8, formatter: (val: any) => { return val } },
	// { prop: 'sapNum', label: 'SAP序列号', span: 8, formatter: (val: any) => { return val } },
	// { prop: 'scale', label: '硬度标尺', span: 8, formatter: (val: any) => { return val } },
	// { prop: 'probe', label: '探头', span: 8, formatter: (val: any) => { return val } },
	// { prop: 'probeType', label: '探头类型', span: 8, formatter: (val: any) => { return val } },
	// { prop: 'scope', label: '测量类型', span: 8, formatter: (val: any) => { return val } },
	// { prop: 'material', label: '材料', span: 8, formatter: (val: any) => { return val } },
	// { prop: 'direction', label: '冲击方向', span: 8, formatter: (val: any) => { return val } },
	// { prop: 'directionCh', label: '测量方向', span: 8, formatter: (val: any) => { return val } },
	// { prop: 'targetUnit', label: '制式', span: 8, formatter: (val: any) => { return val } },
	// { prop: 'loginName', label: '客户账号', span: 8, formatter: (val: any) => { return val } },
	// { prop: 'createTime', label: '创建时间', span: 8, formatter: (val: any) => { return val } },
	// { prop: 'uploadTime', label: '上传时间', span: 8, formatter: (val: any) => { return val } }
]);

const needChangeProps = ['remark1', 'remark2', 'remark3', 'remark4', 'remark5', 'remark6', 'remark7'];

function setNewLabel(prop: string, label:string) {
	for (let detailProp of detailProps) {
		if (needChangeProps.includes(detailProp.prop) && detailProp.prop === prop) {
			detailProp.label = label
			break;
		}
	}
}

// 更改预留字段的显示名称
function changeShowLabel() {
	const list: [] = param.get('list').value;
	for (const item of list) {
		if (item?.keyName && needChangeProps.includes(item?.keyName)) {
			setNewLabel(item?.keyName, item.name);
		}
	}
}

changeShowLabel();

// const chartOption = reactive({
// 	grid: {
// 		left: 0,
// 		top: 0,
// 		right: 0,
// 		bottom: 0
// 	},
// 	xAxis: {
// 		type: "category",
// 		data: [
// 			"00:00",
// 			"2:00",
// 			"4:00",
// 			"6:00",
// 			"8:00",
// 			"10:00",
// 			"12:00",
// 			"14:00",
// 			"16:00",
// 			"18:00",
// 			"20:00",
// 			"22:00"
// 		],
// 		boundaryGap: false
// 	},
// 	yAxis: {
// 		type: "value",
// 		splitLine: {
// 			show: false
// 		},
// 		axisTick: {
// 			show: false
// 		},
// 		axisLine: {
// 			show: false
// 		},
// 		axisLabel: {
// 			show: false
// 		}
// 	},
// 	series: [
// 		{
// 			name: "总访问量",
// 			type: "line",
// 			smooth: true,
// 			showSymbol: false,
// 			symbol: "circle",
// 			symbolSize: 6,
// 			data: [
// 				"1200",
// 				"1400",
// 				"1008",
// 				"1411",
// 				"1026",
// 				"1288",
// 				"1300",
// 				"800",
// 				"1100",
// 				"1000",
// 				"1118",
// 				"1322"
// 			],
// 			areaStyle: {
// 				color: new echarts.graphic.LinearGradient(
// 					0,
// 					0,
// 					0,
// 					1,
// 					[
// 						{
// 							offset: 0,
// 							color: "#D1E5FF"
// 						},
// 						{
// 							offset: 1,
// 							color: "#FFFFFF"
// 						}
// 					],
// 					false
// 				)
// 			},
// 			itemStyle: {
// 				color: "#4165d7"
// 			},
// 			lineStyle: {
// 				width: 2
// 			}
// 		}
// 	]
// });

const chartLoading = ref(false);
const chartDataExists = ref<boolean>(false); // 默认图表数据不存在


// 示波器图像配置
const chartOption = reactive({
	title: {
		// text: '数据图像',
		subtext: "数据图像",
		left: 'center'
	},
	grid: {
		left: 60,
		top: 60,
		right: 50,
		bottom: 60
	},
	tooltip: {
		trigger: 'axis',
		position: function (pt: any) {
			return [pt[0], '10%']
		},
		formatter: (params: any) => {
			// const xData = Number(params[0]?.axisValue).toFixed(3)
			// const yData = params[0].data?.toFixed(3)
			// return `x:${xData}, y:${yData}`
			return `x:${params[0]?.axisValue}, y:${params[0].data}`
		}
	},
	dataZoom: [
		{
			// minSpan: 10,
			xAxisIndex: [0],
			filterMode: 'none',
			type: 'inside',
			// 折线图在数据量远大于像素点时候的降采样策略，
			// 开启后可以有效的优化图表的绘制效率，
			// 默认关闭，也就是全部绘制不过滤数据点。
			// 参考文档：https://echarts.apache.org/zh/option.html#series-line.sampling
			// 可选：
			// 'lttb' 采用 Largest-Triangle-Three-Bucket 算法，
			// 可以最大程度保证采样后线条的趋势，形状和极值。
			// 'average' 取过滤点的平均值
			// 'max' 取过滤点的最大值
			// 'min' 取过滤点的最小值
			// 'sum' 取过滤点的和
			sampling: 'lttb',
			// type: 'slider',
			start: 0,
			end: 100,
			bottom: 5,
		}
	],
	xAxis: {
		data: [],
		boundaryGap: false,
		splitLine: {
			show: true
		}
	},
	yAxis: {
		type: "value",
		axisLine: {
			show: true
		},
		axisTick: {
			show: true
		},
		splitLine: {
			show: true,
			lineStyle: {
				type: "dotted"
			}
		}
	},
	series: [
		{
			type: "line",
			smooth: true,
			showSymbol: false,
			symbol: "circle",
			symbolSize: 6,
			data: [],
			itemStyle: {
				color: "#4165d7"
			},
			lineStyle: {
				width: 2
			}
		}
	]
});

// 初始化图表
function initEChart(ref: HTMLElement | null, option: any) {
	if (ref) {
		const myChart = echarts.init(ref)
		myChart.setOption(option)
		const resizeCallBackFun = () => {
			myChart.resize()
		}
		window.addEventListener('resize', resizeCallBackFun)
	}
}

function downloadCsv(data: object) {
	const {attachmentPath, attachmentName} = data
	const link = document.createElement("a");
	link.setAttribute("href", attachmentPath || "#");
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
	link.setAttribute("download", attachmentName || "");
	link.click();
}

function transferToNumber(inputNumber: any) {
	if (isNaN(Number(inputNumber))) {
		return inputNumber;
	}

	inputNumber = '' + inputNumber;
	inputNumber = parseFloat(inputNumber);
	let format = inputNumber.toExponential(); // 转换为标准的科学计数法形式（字符串）
	let tmpArray = format.match(/\d(?:\.(\d*))?e([+-]\d+)/); // 分离出小数值和指数值
	if (tmpArray && tmpArray[2]) {
		let fractionDigits = Math.max(0, (tmpArray[1] || '').length - Number(tmpArray[2]))
		return inputNumber.toFixed(fractionDigits);
	} else {
		return inputNumber;
	}
}

function parseData(data: []) {
	const xData: any[] = [];
	const yData: never[] = [];
	for (let i = 0; i < data.length; i++) {
		const item = data[i];
		xData.push(transferToNumber(item['time']))
		yData.push(item['Value'])
	}
	return {
		xData,
		yData
	}
}

function init() {
	if (!props.detailData?.attachmentId) {
		return false
	}
	chartLoading.value = true
	service.signal.attachment.info({id: props.detailData.attachmentId}).then(res => {
		if (res && res.data && res.data.length > 0) {
			chartDataExists.value = true;
			nextTick(() => {
				const {xData, yData} = parseData(res.data);
				chartOption.title.subtext = `${props.detailData?.fileCode} 数据图像`;
				chartOption.xAxis.data = <never[]>xData;
				chartOption.series[0].data = yData;
				initEChart(document.getElementById("mainChartRef"), chartOption);
			})
		}
		chartLoading.value = false;
	}).catch(err => {
		ElMessage.error(err.message);
		chartLoading.value = false
	})
}

onMounted(() => {
	init();
})

</script>

<template>
	<el-descriptions
		class="margin-top"
		title=""
		:column="3"
		border
		style="margin: 20px;"
	>
		<el-descriptions-item v-for="(item, idx) in detailProps" :key="idx">
			<template #label>
				<div class="cell-item">{{ item.label }}</div>
			</template>
			<div>
				<span v-if="item.prop !== 'attachmentPath'">{{ detailData[item.prop] }}</span>
				<span v-else><el-link type="primary" @click="downloadCsv(detailData)">点击下载：{{
						detailData['attachmentName']
					}}</el-link></span>
				<!--<span v-if="!item?.formatter">{{ detailData[item.prop] }}</span>-->
				<!--<span v-else>{{ item?.formatter(detailData[item.prop]) }}</span>-->
			</div>
		</el-descriptions-item>
	</el-descriptions>

	<content-divider title="数据图像" style="font-size: 16px;font-weight: bold;"/>

	<div v-if="chartDataExists" id="mainChartRef" v-loading="chartLoading" class="chart-main"/>
	<el-empty v-else description="暂无数据" v-loading="chartLoading" class="chart-main" />

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

.chart-main {
	height: calc(100vh - 565px);
	width: calc(100% - 20px);
	outline: 1px solid #e6ebf5;
	margin: 10px;
}
</style>
