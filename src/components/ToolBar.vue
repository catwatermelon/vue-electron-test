<template>
  <div class="tool-bar">
    <div class="btn" @click="operation('minimize')">-</div>
    <div class="btn del" @click="operation('close')">×</div>
  </div>
</template>

<script setup>
import { ipcRenderer } from "electron";

const operation = operate => {
  ipcRenderer.send("window-operate", {
    operate
  });
};
</script>

<style lang="less" scoped>
.tool-bar {
  border-bottom: 1px solid rgb(240, 239, 239);
  top: 0px;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  position: absolute;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 30px;
  -webkit-app-region: drag;
  .btn {
    height: 18px;
    width: 18px;
    line-height: 18px;
    text-align: center;
    border-radius: 50%;
    background-color: rgba(232, 169, 50, 0.903);
    color: #fff;
    font-size: 14px;
    -webkit-app-region: no-drag;
    &.del {
      background-color: red;
    }
    & + .btn {
      margin-left: 4px;
    }
  }
}
</style>
