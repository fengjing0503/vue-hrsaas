<template>
  <el-calendar v-model="curDate">
    <template #dateCell="{ date }">
      <div class="date-content">
        <span class="text"> {{ new Date(date).getDate() }}</span>
        <span class="rest">{{ getWeeks(date) ? '休' : '' }}</span>
      </div>
    </template>
  </el-calendar>
</template>

<script>
export default {
  name: 'Calender',
  data() {
    return {
      curDate: new Date()
    }
  },
  methods: {
    getWeeks(date) {
      const day = new Date(date).getDay()
      return day === 0 || day === 6
    }
  }
}
</script>

<style lang="scss" scoped>
.select-box {
    display: flex;
    justify-content: flex-end;
}

::v-deep .el-calendar-day {
    height: auto;
}

::v-deep .el-calendar-table__row td::v-deep .el-calendar-table tr td:first-child,
::v-deep .el-calendar-table__row td.prev {
    border: none;
}

.date-content {
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
}

.date-content .rest {
    color: #fff;
    border-radius: 50%;
    background: rgb(250, 124, 77);
    width: 20px;
    // height: 20px;
    line-height: 20px;
    display: inline-block;
    font-size: 12px;
    margin-left: 10px;
}

.date-content .text {
    width: 20px;
    height: 20px;
    line-height: 20px;
    display: inline-block;

}

::v-deep .el-calendar-table td.is-selected .text {
    background: #409eff;
    color: #fff;
    border-radius: 50%;
}

::v-deep .el-calendar__header {
    display: none
}</style>
