<template>
  <div class="home">
    <DragCircle></DragCircle>
    <div class="header">
      <div class="current-item">{{ currentTime }}</div>
      <div class="btn-group">
        <div @click="openWindow('setting')">设置</div>
      </div>
    </div>
    <div class="todo-container">
      <div
        v-for="todo in todoList"
        :key="todo.id"
        :class="['todo-item', { 'task-active': todo.isRunning }]"
      >
        <div class="task-item-wrapper">
          <div class="task-info">
            <div class="task-name">{{ todo.name }}</div>
            <span class="task-delay">{{ todo.time }} 分钟</span>
          </div>
          <div
            class="start-btn"
            v-if="!todo.isRunning"
            @click="startTask(todo)"
          >
            开始任务
          </div>
          <div class="start-btn" v-else @click="closeTask(todo)">
            结束任务
          </div>
        </div>
        <div v-if="todo.isRunning">
          剩余时间：{{ Math.ceil(todo.restTime ?? 0) }} 秒
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ipcRenderer, remote } from "electron";
import DragCircle from "../components/DragCircle.vue";
import { formatDate, setStorage, sendNotification } from "@/utils";

const todoList = ref([]);

setStorage("homeId", remote.getCurrentWindow().id);
ipcRenderer.on("update-todolist", (e, args) => {
  const t = JSON.parse(args);
  todoList.value = t.map(item => ({
    ...item,
    ...{
      isRunning: false,
      endTime: ""
    }
  }));
  taskMap.clear();
});

const openWindow = () => {
  ipcRenderer.send("create-window", {
    windowName: "setting"
  });
};

ipcRenderer.on("get-todolist", e => {
  e.sender.sendTo(
    e.senderId,
    "current-todolist",
    JSON.stringify(todoList.value)
  );
});

const currentTime = ref(formatDate(new Date()));
setInterval(() => {
  const date = new Date();
  currentTime.value = formatDate(date);

  for (let [k, v] of taskMap) {
    v.restTime = (v.endTime - date.getTime()) / 1000;
    if (Math.ceil(v.restTime) == 0) {
      delete v.endTime;
      v.isRunning = false;
      remote
        .Notification({
          title: v.name,
          body: `任务 ${v.name} 于${formatDate(date)}完成，再接再厉~！`,
          icon: require("../assets/watermelon.jpg")
        })
        .show();
      taskMap.delete(k);
    }
  }
}, 500);

const taskMap = new Map();
const startTask = todo => {
  todo.isRunning = true;
  todo.endTime = Date.now() + todo.time * 60 * 1000; // 计算结束时间戳
  taskMap.set(todo.id, todo);
};
const closeTask = todo => {
  todo.isRunning = false;
  delete todo.endTime;
  taskMap.delete(todo.id);
};
</script>

<style lang="less" scoped>
.home {
  font-size: 14px;
  overflow: hidden;
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid rgb(164, 236, 234);
  padding: 10px;
  height: calc(100vh - 38px);

  .header {
    display: flex;
    justify-content: space-between;
    -webkit-app-region: drag;
    margin-bottom: 4px;
    .current-item {
      color: #c1c1c1;
      font-size: 12px;
    }
    .btn-group {
      font-size: 12px;
      color: rgb(100, 100, 248);
      -webkit-app-region: no-drag;
      div {
        cursor: pointer;
      }
    }
  }

  .todo-container {
    height: calc(100vh - 70px);
    font-size: 12px;

    .task-active {
      background-color: rgb(207, 222, 7);
      animation: mymove 1s infinite;
    }
    @keyframes mymove {
      from {
        background-color: rgb(213, 255, 26);
      }
      to {
        background-color: rgb(210, 231, 91);
      }
    }
    .todo-item {
      display: flex;
      flex-direction: column;
      padding: 4px 10px;
      box-sizing: border-box;
      border-radius: 4px;
      background-color: #e6e5e5;

      & + .todo-item {
        margin-top: 4px;
      }
      .task-item-wrapper {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      .task-info {
        display: flex;
        .task-name {
          width: 30px;
          color: blueviolet;
        }
      }
      .start-btn {
        font-weight: bold;
        cursor: pointer;
        &:hover {
          color: blueviolet;
        }
      }
    }
  }
}
</style>
