<template>
<!-- 可以做上拉加载 -->
<!-- div目的是形成滚动条 -->
<!-- 阅读记忆 -->
<div class="scroll-wrapper">
    <!-- van-list组件 如果不加干涉, 初始化完毕 就会检测 自己距离底部的长度,如果超过了限定 ,就会执行 load事件  自动把
       绑定的 loading 变成true  -->
    <van-list v-model="upLoading" :finished="finished" @load="onLoad"></van-list>
</div>
</template>

<script>
export default {
  data () {
    return {
      upLoading: false,
      finished: false
    }
  },
  methods: {
    onLoad () {
      console.log('start loading')
      setTimeout(() => {
        this.finished = true // 表示数据已经全部加载完毕 没有数据了
      }, 1000)
    }
  }
}
</script>

<style>

</style>
