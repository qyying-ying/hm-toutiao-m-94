<template>
<!-- 可以做上拉加载 -->
<!-- div目的是形成滚动条 -->
<!-- 阅读记忆 -->
<div class="scroll-wrapper">
    <!-- van-list组件 如果不加干涉, 初始化完毕 就会检测 自己距离底部的长度,如果超过了限定 ,就会执行 load事件  自动把
       绑定的 loading 变成true  -->
    <van-list finished-text="have no" v-model="upLoading" :finished="finished" @load="onLoad">
        <!-- 循环内容 -->
        <van-cell-group>
          <van-cell v-for="item in articles" :key="item" title="jiyou" :value="'china' + item"></van-cell>
        </van-cell-group>
    </van-list>
</div>
</template>

<script>
export default {
  data () {
    return {
      upLoading: false,
      finished: false,
      articles: [] // 文章列表
    }
  },
  methods: {
    onLoad () {
      console.log('start loading')
      if (this.articles.length > 50) {
        this.finished = true // 关闭加载
      } else {
        const arr = Array.from(Array(15), (value, index) => this.articles.length + index + 1)
        // 上拉加载 不是覆盖之前的数据 应该把数据追加到数组的队尾
        this.articles.push(...arr)
        // 加载完数据 需要手动关掉loading
        this.upLoading = false
      }

    //   setTimeout(() => {
    //     this.finished = true // 表示数据已经全部加载完毕 没有数据了
    //   }, 1000)
    }
  }
}
</script>

<style>

</style>
