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
		console.log(data);  // data就是文件里面的数据
		console.log(JSON.stringify(data))
	}
}

export default { papaparseConfig }
