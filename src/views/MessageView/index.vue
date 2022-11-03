<template>
  <div class="message-view">
    message
    <!-- <el-skeleton animated style="width: 240px">
    <template slot="template">
      <el-skeleton-item variant="image" style="width: 240px; height: 240px;" />
      <div style="padding: 14px;">
        <el-skeleton-item variant="p" style="width: 50%" />
        <div
          style="display: flex; align-items: center; justify-items: space-between;"
        >
          <el-skeleton-item variant="text" style="margin-right: 16px;" />
          <el-skeleton-item variant="text" style="width: 30%;" />
        </div>
      </div>
    </template>
  </el-skeleton> -->
  </div>
</template>

<script>
export default {
  name: "MessageView"
};
</script>

<style lang="less">
.message-view {
  width: 100%;
  min-height: 745px;
  background-color: var(--theme_outer_bg_color);
}
</style>