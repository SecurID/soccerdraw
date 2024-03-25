<!-- ToolbarItem.vue -->
<template>
  <button class="p-2 bg-green-300" @click="emitToolSelection">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'ToolbarItem',
  methods: {
    emitToolSelection() {
      const toolName = this.$el.querySelector('span').textContent.toLowerCase();
      this.$emit('tool-selected', toolName);
    }
  }
}
</script>