<template>
  <div class="container">
    <van-tabs>
      <van-tab :title="`标签${item}`" v-for="item in 10" :key="item">
        <!-- 生成若干个单元格 -->
        <div class="scroll-wrapper">
          <van-cell-group>
           <van-cell title="111" value="222" :key="item" v-for="item in 20"></van-cell>
          </van-cell-group>
        </div>
      </van-tab>
    </van-tabs>
    <span class="bar_btn">
      <van-icon name="wap-nav"></van-icon>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {}
}
</script>
<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  // /deep/  作用：让样式在其他组件生效。可以使 组件中的样式生效 (在scoped的情况下)
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
