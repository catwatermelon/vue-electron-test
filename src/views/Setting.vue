<template>
  <div class="setting">
    <ToolBar></ToolBar>
    <div class="page-content">
      <div class="list-container">
        <div v-for="todo in todoList" :key="todo.id" class="list-item btn">
          <input v-model="todo.name" placeholder="任务名称" />
          <input
            type="number"
            min="0"
            placeholder="持续时间"
            v-model="todo.time"
          />
          <div class="del-btn" @click="deleteOne(todo.id)">×</div>
        </div>
      </div>
      <div class="group-btn">
        <div class="add-btn" @click="addOne"></div>
        <div class="save-btn" @click="save">保存</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ipcRenderer, remote } from "electron";
import { ref } from "vue";
import ToolBar from "../components/ToolBar.vue";
import { getHomeId } from "@/utils";

const currentWindow = remote.getCurrentWindow();
const homeId = +getHomeId();
const todoList = ref([]);

ipcRenderer.sendTo(homeId, "get-todolist");
ipcRenderer.on("current-todolist", (e, args) => {
  todoList.value = JSON.parse(args);
});

const checkInvaild = () => {
  return todoList.value.find(item => !item.name || !item.time);
};

const addOne = () => {
  if (checkInvaild()) {
    return alert("请完善信息！");
  }
  todoList.value.push({
    id: Date.now(),
    name: "",
    time: "",
    endTime: ""
  });
};

const deleteOne = id => {
  todoList.value = todoList.value.filter(item => id !== item.id);
};

const save = () => {
  if (checkInvaild()) {
    return alert("请完善信息！");
  }
  ipcRenderer.sendTo(homeId, "update-todolist", JSON.stringify(todoList.value));
  currentWindow.destroy();
};
const cancel = () => {
  currentWindow.destroy();
};
</script>

<style lang="less" scoped>
.setting {
  font-size: 14px;
  background-color: #fff;
  height: calc(100vh - 28px);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  padding-top: 10px;
  border: 1px solid rgb(164, 236, 234);

  ::-webkit-scrollbar {
    width: 6px; /* 竖向滚动条宽度 */
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px; /* 滚动条样式 */
    background-color: rgb(167, 167, 193); /* 滚动条颜色 */
  }

  .page-content {
    margin-top: 20px;
  }

  .btn {
    width: calc(100% - 14px);
    margin-left: 7px;
    height: 40px;
    border-radius: 6px;
    background-color: rgba(215, 226, 230, 0.5);
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    & ~ .btn {
      margin-top: 4px;
    }
  }
  .list-container {
    height: calc(100vh - 94px);
    overflow: auto;
    margin-bottom: 10px;
    &:empty {
      display: flex;
      justify-content: center;
      align-items: center;
      &::after {
        content: "请点击+号添加任务吧~";
        color: #ddd;
        font-size: 16px;
        font-weight: bold;
      }
    }
    .list-item {
      position: relative;
      padding: 0px 20px;
      box-sizing: border-box;
      display: flex;
      input {
        width: 50%;
        & + input {
          margin-left: 10px;
        }
      }
      .del-btn {
        font-size: 24px;
        font-weight: bold;
        position: absolute;
        right: 0px;
        color: grey;

        &:hover {
          color: red;
        }
      }
    }
  }
  .group-btn {
    display: flex;
    justify-content: flex-end;
    width: calc(100% - 14px);
    margin-left: 7px;
    .btn-style {
      height: 30px;
      line-height: 30px;
      width: 68px;
      text-align: center;
      background-color: #c1c1c1;
      color: #fff;
      border-radius: 6px;
      cursor: pointer;
    }
    .add-btn {
      .btn-style;
      background-color: rgb(21, 162, 162);
      &::after {
        content: "+";
        font-size: 30px;
        color: #fff;
        border-radius: 5px;
      }
    }
    .save-btn {
      .btn-style;
      background-color: rgb(45, 144, 45);
      margin-left: 10px;
    }
  }
}
</style>
