function setVisibilityAndOpacity(el: any, value: any) {
	if (value.show) {
		// el.style.display = ''
		el.style.visibility = 'visible'
		el.style.opacity = 1
	} else {
		// el.style.display = 'none'
		el.style.visibility = 'hidden'
		el.style.opacity = 0
	}
}


export default {
	// 当被绑定的元素插入到 DOM 中时……
	created(el: any, binding: any) {
		const { value } = binding
		setVisibilityAndOpacity(el, value)
	},
	update(el: any, ref: any) {
		/* 更新时的逻辑 */
		const { value } = ref
		setVisibilityAndOpacity(el, value)
	}
};
