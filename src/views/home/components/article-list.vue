<template>
  <!-- 可以做上拉加载 -->
  <!-- div目的是形成滚动条 -->
  <!-- 阅读记忆 -->
  <div class="scroll-wrapper" @scroll="remember">
    <!-- van-list组件 如果不加干涉, 初始化完毕 就会检测 自己距离底部的长度,如果超过了限定 ,就会执行 load事件  自动把
    绑定的 loading 变成true-->
    <!-- 下拉刷新组件包裹 列表组件 -->
    <van-pull-refresh v-model=" downLoading" @refresh="onRefresh" :success-text="successText">
      <van-list finished-text="have no" v-model="upLoading" :finished="finished" @load="onLoad">
        <!-- 循环内容 -->
        <van-cell-group>
          <!-- 给van-cell加一个to属性 可以跳转到对应地址 -->
          <van-cell :to="`/article?artId=${item.art_id.toString()}`" v-for="item in articles" :key="item.art_id.toString()">
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
                <span>{{ item.comm_count }}评论</span>
                <!-- 使用过滤器 -->
                <span>{{ item.pubdate | relTime }}</span>
                <!-- 叉号的显示应该根据当前的登录状态来判断 如果登陆了就显示叉号 没有登录就不显示叉号 -->
                <!-- 最原始的方式 -->
                <!-- <span class="close" v-if="$store.state.user.token"> -->
                <!-- @事件名=“逻辑处理” 点击事件中 触发一个点击显示的事件-->
                <span @click.stop="$emit('showAction', item.art_id.toString())" class="close" v-if="user.token">
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
import { mapState } from 'vuex'
import { getArticles } from '@/api/articles'
import eventBus from '@/utils/eventbus'
export default {
  // 初始化函数
  created () {
    // 监听删除文章事件
    // 相当于有多少个实例 就有多少个监听
    eventBus.$on('delArticle', (artId, channelId) => {
      // 这里要判断一下 传递过来的的频道是否等于自身的频道
      if (channelId === this.channel_id) {
      // 说明当前的这个article-list实例 就是我们要去删除数据的实例
        const index = this.articles.findIndex(item => item.art_id.toString() === artId)
        if (index > -1) {
          this.articles.splice(index, 1) // 删除对应下标的数据
        }
        // 但是如果一只删除 就会将列表数据删光 并不会触发load事件
        if (this.articles.length === 0) {
          // 说明数据删光了
          this.onLoad() // 手动的触发onload事件 给页面加数据
        }
      }
    })
  },
  computed: {
    ...mapState(['user']) // 将user属性映射到计算属性中
  },
  data () {
    return {
      successText: '',
      downLoading: false,
      upLoading: false,
      finished: false,
      articles: [], // 文章列表
      timestamp: null, // 定义一个时间戳 用来存储历史时间戳
      scrollTop: 0 // 定义滚动的位置
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
    // 记录滚动事件
    remember (event) {
      // 函数防抖 在一定时间内 只执行最后一次
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        // 记录滚动到哪个位置
        this.scrollTop = event.target.scrollTop // 记录滚动的位置
      }, 500)
    },
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
