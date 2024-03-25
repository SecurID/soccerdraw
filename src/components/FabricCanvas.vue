<template>
  <div class="flex justify-center">
    <canvas class="border-2 border-gray-500" ref="can" width="1024px" height="765px"></canvas>
  </div>
  <div>
    <toolbar>
      <toolbar-item @tool-selected="handleToolSelection">
        <span>Cone</span>
      </toolbar-item>
      <toolbar-item @tool-selected="handleToolSelection">
        <span>Player</span>
      </toolbar-item>
      <toolbar-item @tool-selected="handleToolSelection">
        <span>Line</span>
      </toolbar-item>
    </toolbar>
  </div>
</template>

<script>
import Toolbar from './Toolbar.vue';
import ToolbarItem from './ToolbarItem.vue';
import { fabric } from 'fabric';

export default {
  components: {
    Toolbar,
    ToolbarItem
  },
  mounted() {
    const ref = this.$refs.can;
    const canvas = new fabric.Canvas(ref);
  },
  methods: {
    handleToolSelection(tool) {
      console.log('Selected tool:', tool);
    }
  }
};
</script>