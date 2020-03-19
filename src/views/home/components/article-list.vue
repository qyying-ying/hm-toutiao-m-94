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
          <van-cell v-for="item in articles" :key="item">
            <!-- 放置文章列表的循环项 无图 单图 三图-->
            <div class="article_item">
              <!-- 标题 -->
              <h3 class="van-ellipsis">加油成为一名优秀的程序媛</h3>
              <!-- 三图图片 -->
              <div class="img_box">
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              </div>
              <!-- 单图 -->
              <!-- <div class="img_box">
                <van-image class="w100" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              </div> -->
              <!-- 作者信息 -->
              <div class="info_box">
                <span>你像一阵风</span>
                <span>8评论</span>
                <span>10分钟前</span>
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
export default {
  data () {
    return {
      successText: '',
      downLoading: false,
      upLoading: false,
      finished: false,
      articles: [] // 文章列表
    }
  },
  methods: {
    // 上拉加载
    onLoad () {
      console.log('start loading')
      if (this.articles.length > 50) {
        this.finished = true // 关闭加载
      } else {
        const arr = Array.from(
          Array(15),
          (value, index) => this.articles.length + index + 1
        )
        // 上拉加载 不是覆盖之前的数据 应该把数据追加到数组的队尾
        this.articles.push(...arr)
        // 加载完数据 需要手动关掉loading
        this.upLoading = false
      }
      //   setTimeout(() => {
      //     this.finished = true // 表示数据已经全部加载完毕 没有数据了
      //   }, 1000)
    },
    // 下拉刷新
    onRefresh () {
      setTimeout(() => {
        const arr = Array.from(
          Array(2),
          (value, index) => '追加' + (index + 1)
        )
        // 数组添加到头部
        this.articles.unshift(...arr)
        // 手动关闭
        this.downLoading = false
        this.successText = `更新了${arr.length}条数据`
      }, 1000)
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
