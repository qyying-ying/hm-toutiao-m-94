<template>
  <!-- 可以做上拉加载 -->
  <!-- div目的是形成滚动条 -->
  <!-- 阅读记忆 -->
  <div class="scroll-wrapper">
    <!-- van-list组件 如果不加干涉, 初始化完毕 就会检测 自己距离底部的长度,如果超过了限定 ,就会执行 load事件  自动把
    绑定的 loading 变成true-->
    <!-- 下拉刷新组件包裹 列表组件 -->
    <van-pull-refresh v-model=" downLoading" @refresh="onRefresh" :success-text="successText">
      <van-list finished-text="have no" v-model="upLoading" :finished="finished" @load="onLoad">
        <!-- 循环内容 -->
        <van-cell-group>
          <van-cell v-for="item in articles" :key="item.art_id.toString()">
            <!-- 放置文章列表的循环项 无图 单图 三图-->
            <div class="article_item">
              <!-- 标题 -->
              <h3 class="van-ellipsis">{{ item.title }}</h3>
              <!-- 根据当前的封面类型决定显示单图 三图 还是无图 -->
              <!-- 三图图片 -->
              <!-- lazy-load表示该图片组件会进行懒加载 -->
              <div class="img_box" v-if="item.cover.type === 3">
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <!-- 单图 -->
              <div class="img_box" v-if="item.cover.type === 1">
                <!-- 单图取第一个 -->
                <van-image lazy-load class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>
              <!-- 作者信息 -->
              <div class="info_box">
                <span>{{ item.aut_name }}</span>
                <span>{{ item.comm_count }}</span>
                <!-- 使用过滤器 -->
                <span>{{ item.pubdate | relTime }}</span>
                <span class="close">
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 引入获取文章模块
import { getArticles } from '@/api/articles'
export default {
  data () {
    return {
      successText: '',
      downLoading: false,
      upLoading: false,
      finished: false,
      articles: [], // 文章列表
      timestamp: null // 定义一个时间戳 用来存储历史时间戳
    }
  },
  // props 对象形式 可以约束传入的值 必填 传值类型
  props: {
    // key(props属性名)：value（对象 配置）
    channel_id: {
      required: true, // 必填项 此属性的含义 true 要求该 props必须传
      type: Number, // 表示要传入的prop属性的类型
      default: null // 默认值的意思 假如你没有传入 prop属性 默认值 就会被采用
    }
  },
  methods: {
    // 上拉加载
    async onLoad () {
      console.log('开始加载文章列表数据')
      // if (this.articles.length > 50) {
      //   this.finished = true // 关闭加载
      // } else {
      //   const arr = Array.from(
      //     Array(15),
      //     (value, index) => this.articles.length + index + 1
      //   )
      //   // 上拉加载 不是覆盖之前的数据 应该把数据追加到数组的队尾
      //   this.articles.push(...arr)
      //   // 加载完数据 需要手动关掉loading
      //   this.upLoading = false
      // }
      //   setTimeout(() => {
      //     this.finished = true // 表示数据已经全部加载完毕 没有数据了
      //   }, 1000)
      // this.timestamp || Date.now()  如果有历史时间戳 用历史时间戳 否则用当前的时间戳
      await this.$sleep() // 人为控制了请求时间
      const data = await getArticles({ channel_id: this.channel_id, timestamp: this.timestamp || Date.now() }) // this.channel_id指的是 当前的频道id
      // 获取内容
      this.articles.push(...data.results) // 将数据追加到队尾
      this.upLoading = false // 关闭加载状态
      // 将历史时间戳给timestamp 但是赋值之前需要判断历史时间戳是否为0
      // 如果历史时间戳为0 说明此事已经没有数据了 应该直接将finished设置为true
      if (data.pre_timestamp) {
        this.timestamp = data.pre_timestamp
      } else {
        this.finished = true
      }
    },
    // 下拉刷新
    async onRefresh () {
      await this.$sleep() // 人为控制了请求时间
      // 下拉刷新应该发送最新的时间戳
      const data = await getArticles({
        channel_id: this.channel_id,
        timestamp: Date.now()
      })
      // 手动的关闭 下拉刷新的状态
      this.downLoading = false
      // 需要判断 最新的时间戳能否换来的数据啊  如果能换来数据 把新数据整个替换旧数据 如果不能  就告诉大家 暂时没有更新
      if (data.results.length) {
        // 如果有返回数据
        // 需要将整个的articles替换
        this.articles = data.results // 历史数据全部被覆盖
        if (data.pre_timestamp) {
          // 因为下拉刷新 换来了一拨新的数据 里面 又有历史时间戳
          this.finished = false // 重新唤醒列表 让列表可以继续上拉加载
          this.timestamp = data.pre_timestamp // 记录历史时间戳给变量
        }
        this.successText = `更新了${data.results.length}条数据`
      } else {
        // 如果换不来新数据
        this.successText = '当前已经是最新了'
      }
      // setTimeout(() => {
      //   const arr = Array.from(
      //     Array(2),
      //     (value, index) => '追加' + (index + 1)
      //   )
      //   // 数组添加到头部
      //   this.articles.unshift(...arr)
      //   // 手动关闭
      //   this.downLoading = false
      //   this.successText = `更新了${arr.length}条数据`
      // }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
