<template>
  <div id="app">
    <!-- 一级路由容器 -->
    <!-- 如果不加控制 会缓存所有的组件实例 -->
    <!-- 只要keep-alive包裹 就会缓存所有实例 -->
    <!-- 如果不包裹 就不缓存实例 -->
    <keep-alive>
      <router-view v-if="$route.meta.isAlive" />
    </keep-alive>
    <!-- 条件渲染 -->
    <router-view v-if="!$route.meta.isAlive"></router-view>
     <!-- 要根据当前的meta中的isAlive属性 决定是否缓存组件 $route.neta.isAlive  -->
  </div>
</template>

<style lang="less">

</style>
