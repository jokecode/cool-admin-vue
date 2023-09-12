<script setup lang="ts" name="help">
import Papa from 'papaparse';
const config = {
	"delimiter": ":",
	"header": false,
	"dynamicTyping": false,
	"skipEmptyLines": false,
	"preview": 0,
	"encoding": "",
	"worker": false,
	"comments": "",
	"download": false,
	"complete": (res:any) => {
		// UTF8 \r\n与\n混用时有可能会出问题
		let data = res.data;
		if (data[data.length - 1] == "") {
			//去除最后的空行
			data.pop();
		}
		console.log(data);  // data就是文件里面的数据
		console.log(JSON.stringify(data))
	}
}

function changeFile(event: Event) {
	const target = event.target as HTMLInputElement;
	const files = target?.files;
	if (files && files.length > 0) {
		const file = files[0]
		Papa.parse(file, config);
	}
}

</script>

<template>
	<div>帮助文档</div>
	<br>
	<!--<el-button @click="readAndParseCSV">测试</el-button>-->
	<!--<el-button @click="printRef">printRef</el-button>-->
	<br>
	<br>
	<br>
	<div>
		<input type="file" accept="text/csv" @change="changeFile">
	</div>

</template>

<style scoped lang="scss">

</style>
