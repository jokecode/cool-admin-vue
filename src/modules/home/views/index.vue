<template>
	<div class="page-home">
		<div class="top">
			<cl-avatar shape="square" :size="38" :src="userInfo?.info?.headImg" style="margin-right: 12px;"/>
			<h2 style="opacity: 0.85;">{{ greeting }}<span v-if="userInfo?.info">{{ userInfo?.info?.nickName }}</span>，祝你开心每一天！
			</h2>
		</div>
		<div class="center">
			<el-carousel class="carousel" height="calc(100vh - 276px)" indicator-position="none" :interval="5000"
			             arrow="never" autoplay>
				<el-carousel-item>
					<div
						style="display: flex;flex-direction: column;justify-content: center;align-items: center;height: 100%;color: #475669;">
						<div style="opacity: 0.85;">
							<h1>“枪械无源射弹计数器”成果转化应用项目</h1>
						</div>
						<div style="margin: 30px 0 150px 0;opacity: 0.8;">
							<h2>枪械射击特征信号知识图谱</h2>
						</div>
						<div style="line-height: 2em;opacity: 0.75;">
							<h3>应用总体单位：重庆建设工业（集团）有限责任公司</h3>
							<h3>成果申报单位：{{ companyName }}</h3>
						</div>
					</div>
				</el-carousel-item>
			</el-carousel>
		</div>
		<div class="bottom">
			<!--<div>Designed & Powerd by xy</div>-->
			<div>Copyright {{ copyright }} {{ companyName }}</div>
			<div>最后更新日期：{{ systemUpdateDate }} 版本：{{ version }}</div>
		</div>
	</div>
</template>

<script lang="ts" name="home" setup>
import {useBase} from "/$/base";
import {ref} from "vue";

const {user} = useBase();

const userInfo = ref<Eps.BaseSysUserEntity>({
	...user
})

const version = ref<string>(import.meta.env.VITE_APP_VERSION)
const systemUpdateDate = ref<string>(import.meta.env.VITE_APP_SYSTEM_UPDATE_DATE)
const companyName = ref<string>(import.meta.env.VITE_APP_COMPANY_NAME)
const copyright = ref<string>(import.meta.env.VITE_APP_COPYRIGHT)


const greeting = ref<string>('')
const now = (new Date()).getHours();

if (now > 0 && now <= 6) {
	greeting.value = "午夜好，";
} else if (now > 6 && now <= 11) {
	greeting.value = "早上好，";
} else if (now > 11 && now <= 14) {
	greeting.value = "中午好，";
} else if (now > 14 && now <= 18) {
	greeting.value = "下午好，";
} else {
	greeting.value = "晚上好，";
}
</script>

<style lang="scss" scoped>
.top {
	display: flex;
	background-color: white;
	padding: 15px;
	align-items: center;

	h2 {
		font-family: "Times New Roman", Times, serif;

		span {
			font-family: "Times New Roman", Times, serif;
		}
	}
}

.center {
	background-color: white;
	height: calc(100vh - 276px);
	padding: 0 15px 15px 15px;
}

.bottom {
	background-color: white;
	text-align: center;
	line-height: 2em;
	padding-top: 5px;
	padding-bottom: 10px;
	opacity: 0.8;
}

.carousel {
	//background-color: #99a9bf;
	//background-color: #d3dce6;
	background-color: #d3dce6a8;
	border-radius: 10px;
	//background-image: linear-gradient(rgba(211, 220, 230, 0.6), rgb(71, 86, 105));
	//background-image: linear-gradient(rgba(0, 0, 255, 0.5), rgba(255, 255, 0, 0.5));
	//background-image: url("/home_bg.png");
	/* 兜底，IE和Firefox浏览器 */
	background-image: url("/home_bg.png");
	--transparent: url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==);
	/* Safari最近版本已经不需要私有前缀了 */
	background-image: cross-fade(var(--transparent), url(/home_bg.png), 75%);
	/* 如使用自定义属性，-webkit-语句需要放在没有私有前缀语句的下面 */
	background-image: -webkit-cross-fade(var(--transparent), url(/home_bg.png), 75%);
	background-size: cover;
}

/*
.el-carousel__item:nth-child(2n) {
	//background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
	//background-color: #d3dce6;
}*/

</style>
