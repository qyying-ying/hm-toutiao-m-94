<template>
  <div class="container">
    <!-- 导航组件 采用vant组件 fixed表示固定在顶部-->
    <!-- 当页面地址是/user的时候 应该隐藏掉导航行 否则不隐藏 -->
    <!-- <van-nav-bar @click-right="$router.push('/search')" fixed title="黑马头条" right-text="搜索" v-if="$route.path!= '/user'"></van-nav-bar> -->
    <van-nav-bar   @click-right="$router.push('/search')" fixed title="黑马头条" right-text="搜索" v-if="$route.path!== '/user'"></van-nav-bar>
    <!-- 二级路由容器 -->
    <!-- 判断当前的地址 如果是/uesr 就给一个noTopClass -->
    <div class="my-wrapper" :class="{noTop: !showNavBar}">
    <router-view></router-view>
    </div>
    <!-- 标签组件 -->
    <!-- 标签栏  开启路由模式 route :route="true"(布尔)  route="true"(字符串)-->
    <van-tabbar route>
      <!-- 应该点击导航的标签跳转路由  -->
      <!-- 一旦启用路由模式 van-tabbar-item 就可以当做router-link使用 -->
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/question" icon="chat-o">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'layout',
  computed: {
    showNavBar () {
      return this.$route.path !== '/user'
    }
  }
}

</script>

<style scoped lang='less'>
.container{
  width: 100%;
  height: 100%;
  position: relative;
  .my-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop{
      padding-top: 0;
    }
  }
}
</style>
