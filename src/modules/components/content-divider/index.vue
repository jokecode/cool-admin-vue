<template>
  <div style="display: flex;align-items: center;">
    <div class="divider-block" :style="{ width: blockWidth }" />
    <div class="divider-title">{{ title }}</div>
  </div>
</template>

<script>
export default {
  name: 'ContentDivider',
  props: {
    title: {
      type: String,
      required: true
    },
    blockWidth: {
      type: String,
      required: false,
      default: '4px'
    }
  }
}
</script>

<style scoped>
  .divider-block {
    background-color: #1b64f1;
    height: 1em;
    margin-left: 8px;
    margin-right: 8px;
    position: relative;
  }
  .divider-title {
    display: inline-block;
  }
</style>
