<template>
  <div :class="titleStyle">
    <div class="title">
      <div style="min-width: 60px; display: flex">
        {{ title }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { ipcRenderer } from "electron";

const props = defineProps({
  title: {
    type: String,
    default: "期权客户端"
  }
});
// 监听窗口聚焦失焦事件
const titleStyle = ref("title-bar");
ipcRenderer.on("blur", () => {
  titleStyle.value = "title-bar";
});
ipcRenderer.on("focus", () => {
  titleStyle.value = "title-bar title-bar-focus";
});

watch(
  () => props.title,
  () => {
    document.title = props.title;
  },
  {
    immediate: true
  }
);
</script>

<style lang="less" scoped>
.close-modal {
  color: #fff;
}
.title-bar-focus {
  background-color: #646464 !important;
  mix-blend-mode: difference;
}
.title-bar {
  display: flex;
  align-items: center;
  background-color: #646464;
  box-sizing: border-box;
  height: 30px;
  overflow: hidden;
  width: 100vw;
  padding: 0 14px;
  width: calc(100vw - 2px);
  margin: 1px 0px 0 1px;
  -webkit-app-region: drag;

  .title {
    display: flex;
    align-items: center;

    & > :deep(.anticon) {
      margin-bottom: 2px;
      font-size: 20px;
      margin-right: 6px;
    }
  }
  .right-operation {
    margin-left: auto;
    display: flex;
    align-items: center;

    .highlight {
      background-color: bisque;
    }
  }
}
</style>
