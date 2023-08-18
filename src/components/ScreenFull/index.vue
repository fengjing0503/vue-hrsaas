<template>
  <!-- 放置一个图标 -->
  <div style="display:inline-block">
    <svg-icon :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" class="fullscreen" @click="toggleScreen" />
  </div>
</template>

<script>
import screenfull from 'screenfull'
export default {
  name: 'ScreenFull',
  data() {
    return {
      isFullscreen: false
    }
  },
  created() {
    // ESC会改变当前的全屏状态
    // screenfull是插件，它自带事件监听 on
    // screenfull.isFullscreen ：插件自带的属性，表示当前是否处于全屏状态
    screenfull.on('change', () => {
      // console.log('当前是否是全屏', screenfull.isFullscreen)
      this.isFullscreen = screenfull.isFullscreen
      // console.log(this.isFullscreen)
    })
  },
  methods: {
    toggleScreen() {
      screenfull.toggle()
    }
  }

}
</script>

<style lang="scss" scoped>
.fullscreen {
    width: 20px;
    height: 20px;
    color: #fff;
    cursor: pointer;
    margin-right: 20px;
    // font-size: 19px;
}
</style>
