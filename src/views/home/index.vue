<template>
  <div class="container">
    <!-- 默认绑定激活页签 -->
    <van-tabs v-model="activeIndex">
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <!-- 生成若干个单元格 -->
        <!-- <div class="scroll-wrapper">
          <van-cell-group>
           <van-cell title="111" value="222" :key="item" v-for="item in 20"></van-cell>
          </van-cell-group>
        </div> -->
        <!-- 有多少个tab 就有多少个article-list 相当于多个article-list实例 -->
        <!-- 传递数据 -->
        <!-- 监听article-list触发的showAction事件 -->
        <!-- 监听谁触发的自定义事件 就在谁的标签上写监听 -->
        <ArticleList @showAction="openAction" :channel_id="item.id"></ArticleList>
      </van-tab>
    </van-tabs>
    <span class="bar_btn" @click="showChannelEdit = true">
      <van-icon name="wap-nav"></van-icon>
    </span>
    <!-- 放置一个弹层组件 -->
    <van-popup v-model="showMoreAction" style="width: 80%">
      <!-- 放置反馈组件 -->
      <!-- 应该在此位置监听more-action触发的事件 -->
      <!-- 不喜欢文章和举报文章用一个方法 -->
      <MoreAction @dislike="dislikeOrReport('dislike')" @report="dislikeOrReport('report', $event)"/>
    </van-popup>
    <!-- 频道编辑组件放在弹出面板的组件 -->
    <van-action-sheet :round="false" v-model="showChannelEdit" title="编辑频道">
      <!-- 放置频道编辑组件 -->
      <!-- 此时将父组件的数据传递给了子组件 -->
      <ChannelEdit @delChannel="delChannel" :activeIndex="activeIndex" @selectChannel="selectChannel" :channels="channels"></ChannelEdit>
    </van-action-sheet>
  </div>
</template>

<script>
import ArticleList from './components/article-list'
import MoreAction from './components/more-action'
import { getMyChannels, delChannel } from '@/api/channels'
import { dislikeArticle, reportArticle } from '@/api/articles'
import eventbus from '@/utils/eventbus' // 公共事件处理器
import ChannelEdit from './components/channel-edit' // 引入编辑频道组件
export default {
  name: 'Home',
  components: {
    ArticleList, MoreAction, ChannelEdit
  },
  data () {
    return {
      channels: [], // 接收频道数据
      showMoreAction: false, // 是否显示弹层 默认不显示
      articleId: null, // 用来接收点击的文章id
      activeIndex: 0, // 当前默认激活的页签0
      showChannelEdit: false // 是否显示频道编辑组件 默认不显示
    }
  },
  methods: {
    // 删除频道的方法
    async delChannel (id) {
      // 此时应该先调用api
      try {
        await delChannel(id) // 调用api方法 此时只是删除了缓存中的数据
        // 如果此时成功的resolve了 我们应该去一处当前data中的数据
        const index = this.channels.findIndex(item => item.id === id)
        if (index <= this.activeIndex) {
          //  如果你删除的索引 是在当前激活索引之前的 或者等于当前激活索引的
          // 此时就要把激活索引 给往前挪一位
          this.activeIndex = this.activeIndex - 1
        }
        this.channels.splice(index, 1) // 删除对应的索引频道
      } catch (error) {
        this.$gnotify({ message: '删除频道失败' })
      }
    },
    async getMyChannels () {
      const data = await getMyChannels() // 接收返回的数据结果
      this.channels = data.channels // 将数据赋值给data中的数据
    },
    // 当子组件触发selectChannel时 触发该方法
    // selectChannel (id) {
    //   // 拿到id后 应该找到id所对应的索引
    //   const index = this.channels.findIndex(item => item.id === id)
    //   this.activeIndex = index // 将对应频道的索引 设置给当前激活的 标签
    //   this.showChannelEdit = false // 关闭弹层
    // },
    selectChannel (index) {
      // 拿到id后 应该找到id所对应的索引
      // const index = this.channels.findIndex(item => item.id === id)
      this.activeIndex = index // 将对应频道的索引 设置给当前激活的 标签
      this.showChannelEdit = false // 关闭弹层
    },
    openAction (artId) {
      this.showMoreAction = true
      // 应该把id给存储起来
      this.articleId = artId
    },
    // 对文章不感兴趣
    // operateType是操作类型 如果是dislike 就是不喜欢 如果是 report 就是 举报
    async dislikeOrReport (operateType, type) {
      // 调用不感兴趣的接口
      try {
        // 需要根据一个参数来判断 是举报还是不喜欢
        operateType === 'dislike' ? await dislikeArticle({
          target: this.articleId // 不感兴趣的id
        }) : await reportArticle({ target: this.articleId, type }) //  这里的type怎么办 ?????? 通过$event传出来
        // await下方的逻辑是resolve（成功）之后的
        this.$gnotify({
          type: 'success',
          message: '操作成功'
        })
        // 应该触发一个事件 利用事件广播的机制 通知对应的tab 来删除文章数据
        // this.channels[this.activeIndex].id 当前激活的频道数据
        eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id) // 名称， 参数
        // 监听了这个事件组件 就要根据id来删除数据
        this.showMoreAction = false // 此时关闭弹层
      } catch (error) {
        this.$gnotify({
          message: '操作失败'
        })
      }
    }
    // // 举报文章
    // async reportArticle (type) {
    //   try {
    //     // 调用举报接口
    //     await reportArticle({ target: this.articleId, type })
    //     this.$gnotify({
    //       type: 'success',
    //       message: '举报成功'
    //     })
    //     // action下方认为举报成功
    //     // 同样的也要将举报的文章删除掉
    //     eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id) // 名称， 参数
    //     this.showMoreAction = false
    //   } catch (error) {
    //     this.$gnotify({
    //       message: '举报失败'
    //     })
    //   }
    // }
  },
  created () {
    this.getMyChannels()
  }
}
</script>
<style lang="less" scoped>
// 处理面板样式
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
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
