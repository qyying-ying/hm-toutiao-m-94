<template>
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list" ref="myList">
      <!-- 需要把list消息循环渲染到视图上 -->
      <!-- 认为小智同学说的话 在左边 我说的话 在右边 -->
      <!-- name： xz =》 小智左边 name ！=xz =》我 =》右边 -->
      <div class="chat-item" :class="{left: item.name === 'xz', right: item.name!=='xz'}" v-for="(item,index) in list" :key="index">
        <!-- 如果是小智说的 头像应该在左边 -->
        <van-image v-if="item.name==='xz'" fit="cover" round :src="XZImg" />
        <!-- 内容 -->
        <div class="chat-pao">{{ item.msg }}</div>
        <!-- 如果不等于小智 头像右边 -->
        <van-image v-if="item.name!='xz'"  fit="cover" round :src="photo" />
      </div>
      <!-- <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>
        <van-image  fit="cover" round :src="photo" />
      </div> -->
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="value" placeholder="说点什么...">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import XZImg from '@/assets/head.jpg' // 引入图片
import { mapState } from 'vuex' // vuex辅助函数
import io from 'socket.io-client' // 引入socket.io客户端
import Vue from 'vue'
// import func from '../../../vue-temp/vue-editor-bridge'
export default {
  data () {
    return {
      loading: false, // 用来控制输入的状态
      value: '', // 用来存储输入内容
      XZImg, // 将图片地址赋值到data中变量
      list: [] // 用来存储小智同学和我的聊天记录
    }
  },
  computed: {
    ...mapState(['photo', 'user']) // 当前用户的头像地址
  },
  // 初始化钩子函数
  created () {
  //  建立与服务端的连接
  // new WebSocket (原生)
  // io 需要传参数 接口规定的
  // 初始化websocket连接
    this.socket = io('http://ttapi.research.itcast.cn', {
      // 固定写法 它会拼接到url地址上 ?后面
      query: {
        token: this.user.token // vuex中的token
      }
    }) // 这里用this.socket 接收 目的是 在其他方法 依然可以用 this.socket获取对象实例
    // 怎么监听连接成功  ws.onopen(原生)
    // connect 是固定的写法 意思是表示当前已经建立连接成功
    this.socket.on('connect', () => {
      //  此时执行 connect事件 表示 已经和服务器打通了电话
      // 我们模拟一条数据 让用户看到 服务器和用户说话了
      this.list.push({ msg: 'hello', name: 'xz' }) // 加name的原因是想区分 这句话是谁说的
    })
    // 此时监听回复消息
    // 提前开启监听
    this.socket.on('message', data => {
      // data就是 客户服务器回复的消息
      this.list.push({ ...data, name: 'xz' }) // 加到列表中
      this.scrollBottom() // 接消息之后
    })
  },
  methods: {
    // 将内容滚动到底部 设置 滚动条的scrollTop(滚动条距离顶部的长度) = scrollHeight(整个容器的实际高度W)
    scrollBottom () {
      // // this.$nextTick 此函数 会在 上一次数据更新 并且完成页面渲染之后执行
      // this.$nextTick(() => {
      //   //  在这个回调函数中  上一次的数据更新结果 已经 反映到了视图上 视图已经更新了
      //   this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight
      //   // 此时表示 滚动滚动条的时候 视图上数据已经是最新了
      // })
      // // 这是使用组件实例的方式
      Vue.nextTick(() => {
        // 这是使用全局对象的方式 也表示 上一次数据更新 完成页面渲染之后 执行 该函数
        this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight // 将滚动条滚动到最底部
      })
    },
    // 发送消息方法
    send () {
      // 调用websocket发出一个消息
      // 发消息之前 要判断
      if (!this.value) return false // // 如果字符串为空就不能再发消息了
      // 如果不为空  首先需要 将状态 打开
      this.loading = true // 打开状态的目的是防止重复提交
      // 使用websocket发送消息
      // socket.io
      // socket.emit(消息类型, 消息内容)
      const obj = {
        msg: this.value, // 消息内容
        timestamp: Date.now()// 给一个当前的时间戳
      }
      this.socket.emit('message', obj) // 发送消息
      // 发送消息之后干什么
      this.list.push(obj) // 将发出的消息加入到消息列表中
      // 发送完消息之后
      this.value = '' // 清空消息内容
      this.loading = false // 关掉状态
      this.scrollBottom() // 发消息之后
    }
  },
  // 实例销毁前
  beforeDestroy () {
    // 需要在实例销毁之前  把websocket连接给关掉
    // ws.close() 原生    socket.io  close()
    this.socket.close() // 直接关闭连接
  }

}
</script>

<style lang='less' scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
