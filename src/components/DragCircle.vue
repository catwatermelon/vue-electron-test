<template>
  <div class="drag-circle"></div>
</template>

<style lang="less" scoped>
.drag-circle {
  position: fixed;
  top: 4px;
  right: 4px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: rgb(81, 202, 83);
  -webkit-app-region: drag;
}
</style>
