<script setup lang="ts" name="comparison">
import {onMounted, reactive, ref} from "vue";
import * as echarts from "echarts";
import ContentDivider from '/@/modules/components/content-divider/index.vue'
import {useCool} from "/@/cool";
import {ElMessage} from "element-plus";
import {Feature} from "/$/signal/entity/feature";

const {service} = useCool();
const props = defineProps({
	detailDataList: {
		type: Array,
		default: () => {
			return []
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
])

const chartLoadings = ref<boolean>(false)

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
			return `x:${params[0]?.axisValue}, y:${params[0].data}`;
		}
	},
	dataZoom: [
		{
			minSpan: 10,
			xAxisIndex: [0],
			filterMode: 'none',
			type: 'inside',
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
		},
		axisLine: {
			symbol: ['none', 'arrow'], // 箭头一端没效果,一端箭头
			symbolOffset: [0, 15], // 箭头段移动8个像素
		}
	},
	yAxis: {
		type: "value",
		axisLine: {
			show: true,
			symbol: ['none', 'arrow'], // 箭头一端没效果,一端箭头
			symbolOffset: [0, 15], // 箭头段移动8个像素
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

const allChartOption = reactive({
	legend: {
		// data:['曲线1', '曲线2']
		data: []
	},
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'cross',
			animation: false,
		}
	},
	toolbox: {
		show: true,
		feature: {
			dataZoom: {
				 yAxisIndex: 'none'
			},
			dataView: {readOnly: false},
			//magicType: {type: ['line']},
			restore: {},
			saveAsImage: {}
		}
	},
	dataZoom: [
		{
			minSpan: 10,
			xAxisIndex: [0],
			filterMode: 'none',
			// type: 'inside',
			type: 'slider',
			start: 0,
			end: 100,
			bottom: 5,
		}
	],
	grid: {
		left: 60,
		right: 50,
		top: 70,
		bottom: 50
	},
	xAxis: {
		type: 'value',
		name: 'time',
		nameTextStyle: {
			color: '#333'
		},
		scale: true
	},
	yAxis: {
		name: 'Value',
		type: 'value',
		nameTextStyle: {
			color: '#333'
		}
	},
	series: [
		// {
		//   name:'曲线1',
		//   symbolSize: 5,
		//   data: [
		//     [0.99, 4],
		//     [1.1, 9],
		//     [1.21, 18],
		//     [1.32, 40],
		//     [1.53, 71],
		//     [1.74, 88],
		//     [1.85, 55],
		//     [1.96, 32],
		//     [2.07, 9],
		//     [2.38, 0.2]
		//   ],
		//   type: 'line',
		//   smooth:true,
		//   showSymbol: false,
		//   // barGap: 0
		// },
		// {
		//   name:'曲线2',
		//   symbolSize: 5,
		//   data: [
		//     [0.98, 1],
		//     [1.3, 6],
		//     [1.41, 27],
		//     [1.62, 45],
		//     [1.73, 77],
		//     [1.84, 85],
		//     [2.05, 47],
		//     [2.16, 18],
		//     [2.37, 6],
		//     [2.38, 0.2]
		//   ],
		//   type: 'line',
		//   smooth:true,
		//   showSymbol:false,
		//   barGap: 0
		// }
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

function parseAllData(data: []) {
	const result: any[] = [];
	for (let i = 0; i < data.length; i++) {
		const item = data[i];
		result.push([transferToNumber(item['time']), item['Value']])
	}
	return result
}

onMounted(() => {
	const requestAttIds = []
	const promiseList = []
	for (let i = 0; i < props.detailDataList?.length; i++) {
		const item: Feature = <Feature>props.detailDataList[i];
		item['attachmentId'] && requestAttIds.push(item['attachmentId'])
		// const option = JSON.parse(JSON.stringify(chartOption))
		const id = item['attachmentId']
		if (id) {
			promiseList.push(service.signal.attachment.info({id: id}));
		}
		// service.signal.attachment.info({id:item['attachmentId']}).then(res => {
		//   option.title.subtext = `${item.fileCode} 数据图像`
		//   const { xData, yData } = parseData(res['data'])
		//   option.xAxis.data = <never[]>xData
		//   option.series[0].data = yData
		//   initEChart(document.getElementById(`id_${item['id']}`), option);
		// })
	}
	if (promiseList && promiseList.length > 0) {
		chartLoadings.value = true
		Promise.all(promiseList).then((res = []) => {
			for (const item of res) {
				const option = JSON.parse(JSON.stringify(chartOption))
				const featureItem = getFeatureItemByAttId(<[]>props.detailDataList, item?.id)
				option.title.subtext = `${featureItem?.fileCode} 数据图像`
				const {xData, yData} = parseData(item['data'])
				option.xAxis.data = <never[]>xData
				option.series[0].data = yData
				initEChart(document.getElementById(`id_${item['id']}`), option);
			}
			chartLoadings.value = false;

			// const seriesItem = {
			//   name:'曲线2',
			//   symbolSize: 5,
			//   data: [],
			//   type: 'line',
			//   smooth:true,
			//   showSymbol:false,
			//   barGap: 0
			// }
			allChartOption.legend.data = []
			allChartOption.series = []
			const options = JSON.parse(JSON.stringify(allChartOption))
			for (const detailItem of props.detailDataList) {
				options.legend.data.push(detailItem?.fileCode);
				const attachmentItem = getAttachmentItemByAttId(<[]>res, detailItem?.attachmentId)
				options.series.push({
					name: detailItem?.fileCode,
					symbolSize: 5,
					data: parseAllData(attachmentItem),
					type: 'line',
					smooth: true,
					showSymbol: false,
					barGap: 0
				})
			}

			console.log('options======>', options)
			initEChart(document.getElementById('mainChartRef'), options)

		}).catch(err => {
			ElMessage.error(err.message);
			chartLoadings.value = false;
		})
	}


	// service.signal.attachment.listByIds({ids: requestAttIds}).then(res => {
	//   console.log(res, '<=============')
	// }).catch(err => {
	//   ElMessage.error(err.message);
	// })
})

function getAttachmentItemByAttId(arr: [], attId: any) {
	const findItem = arr.find((item) => {
		return item?.id == attId
	})
	return findItem?.data
}

function getFeatureItemByAttId(arr: [], attId: any) {
	return arr.find((item) => {
		return item?.attachmentId == attId
	})
}

</script>

<template>
	<el-scrollbar :always="true" :native="true" :min-size="40"
	              max-height="calc(100vh - 111px)"
	              style="background-color: white;">
		<div :style="{height: `${(100 + 500 + detailDataList.length * 400)}px`}">
			<el-tabs type="border-card" style="margin: 10px;">
				<el-tab-pane v-for="(detailData, index) in detailDataList" :key="index" :label="detailData.fileCode">
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
								<!-- 提供文件下载链接 -->
								<span v-else>
								<el-link v-if="detailData.attachmentPath" type="primary"
								         @click="downloadCsv(detailData)">点击下载：{{
										detailData['attachmentName']
									}}</el-link>
								<span v-else>{{ detailData['attachmentName'] }}</span>
							</span>
								<!--<span v-if="!item?.formatter">{{ detailData[item.prop] }}</span>-->
								<!--<span v-else>{{ item?.formatter(detailData[item.prop]) }}</span>-->
							</div>
						</el-descriptions-item>
					</el-descriptions>
				</el-tab-pane>
			</el-tabs>

			<br>
			<div style="display: flex;justify-content: flex-start;align-items: center;">
				<content-divider title="数据图像" style="font-size: 16px;font-weight: bold; margin-right: 30px;"/>
				<div style="display: flex;align-items: center;">
					<div>是否显示图表：</div>
					<el-checkbox v-for="(item, index) in detailDataList" v-model="item.showChart" :key="index"
					             :label="item.fileCode"/>
				</div>
			</div>

			<div id="mainChartRef" v-loading="chartLoadings" class="chart-main"/>

			<div v-for="(item, index) in detailDataList" v-show="item.showChart" :id="`id_${item.attachmentId}`"
			     :key="index" v-loading="chartLoadings" class="chart-main"/>
			<br><br>
		</div>
	</el-scrollbar>
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
