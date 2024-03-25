<template>
  <div class="flex flex-col items-center">
    <div class="flex justify-center">
      <canvas
          class="border-2 border-gray-500"
          ref="can"
          width="1024"
          height="765"
          @mouse:down="handleMouseDown"
          @mouse:move="handleMouseMove"
          @mouse:up="handleMouseUp"
          @object:modified="handleObjectModified"
          tabindex="0"
      ></canvas>
    </div>
    <div>
      <toolbar>
        <toolbar-item @tool-selected="selectTool('cone')">
          <span>Cone</span>
        </toolbar-item>
        <toolbar-item @tool-selected="selectTool('player-offense')">
          <span>Player Offense</span>
        </toolbar-item>
        <toolbar-item @tool-selected="selectTool('player-defense')">
          <span>Player Defense</span>
        </toolbar-item>
        <toolbar-item @tool-selected="selectTool('line')">
          <span>Line</span>
        </toolbar-item>
        <!--<div>
          <label for="color" class="mr-2">Color:</label>
          <input
              id="color"
              type="color"
              v-model="objectColor"
          />
        </div>-->
      </toolbar>
    </div>
  </div>
</template>

<script>
import '../classes/arrow-line.js';
import '../classes/cross.js';
import Toolbar from './Toolbar.vue';
import ToolbarItem from './ToolbarItem.vue';
import {fabric} from 'fabric';

export default {
  components: {
    Toolbar,
    ToolbarItem
  },
  data() {
    return {
      canvas: null,
      currentTool: null,
      isDrawing: false,
      startPoint: null,
      currentObject: null,
      objectSize: 20,
      objectColor: '#000000'
    }
  },
  mounted() {
    const ref = this.$refs.can;
    this.canvas = new fabric.Canvas(ref);
    this.drawFootballField(); // Call the method to draw the field here
    this.canvas.on('mouse:down', this.handleMouseDown);
    this.canvas.on('mouse:move', this.handleMouseMove);
    this.canvas.on('mouse:up', this.handleMouseUp);
    this.canvas.on('object:modified', this.handleObjectModified);

    document.addEventListener('keydown', this.handleKeyDown);
  },
  beforeDestroy() {
    // Remove the keydown listener when the component is destroyed
    document.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {
    selectTool(tool) {
      this.currentTool = tool;
      if (this.currentObject) {
        this.canvas.discardActiveObject();
        this.currentObject = null;
      }
    },
    handleMouseDown(e) {
      if (e.target) {
        // An existing object was clicked, do not proceed with drawing a new element
        return;
      }
      if (this.currentTool === 'line') {
        if (!this.isDrawing) {
          this.isDrawing = true;
          this.startPoint = new fabric.Point(e.absolutePointer.x, e.absolutePointer.y);
        } else {
          const endPoint = new fabric.Point(e.absolutePointer.x, e.absolutePointer.y);
          const line = new fabric.LineArrow([this.startPoint.x, this.startPoint.y, endPoint.x, endPoint.y], {
            strokeWidth: this.objectSize / 3,
            fill: this.objectColor,
            stroke: this.objectColor,
            originX: 'center',
            originY: 'center',
            hasBorders: false,
            hasControls: false
          });
          this.canvas.add(line);
          this.isDrawing = false;
          this.startPoint = null;
        }
      } else {
        this.isDrawing = true;
        this.startPoint = new fabric.Point(e.absolutePointer.x, e.absolutePointer.y);

        if (this.currentTool === 'cone') {
          this.currentObject = new fabric.Triangle({
            left: this.startPoint.x - (this.objectSize / 2),
            top: this.startPoint.y - (this.objectSize / 2),
            width: this.objectSize,
            height: this.objectSize,
            // fill with orange color
            fill: '#FFA500'
          });
        } else if (this.currentTool === 'player-offense') {
          this.currentObject = new fabric.Circle({
            left: this.startPoint.x - (this.objectSize / 2),
            top: this.startPoint.y - (this.objectSize / 2),
            radius: this.objectSize / 2,
            fill: 'red'
          });
        } else if (this.currentTool === 'player-defense') {
          this.currentObject = new fabric.Cross({
            left: this.startPoint.x, // X-coordinate where the click occurred
            top: this.startPoint.y, // Y-coordinate where the click occurred
            fill: 'black', // Color of the cross
            strokeWidth: this.objectSize / 8, // Thickness of the cross lines
            width: this.objectSize, // Width of the cross
            height: this.objectSize, // Height of the cross
            angle: 45, // Rotate the cross 45 degrees
            originX: 'center', // Set the horizontal origin of rotation and positioning to the center
            originY: 'center', // Set the vertical origin of rotation and positioning to the center
          });
        }

        if (this.currentObject) {
          this.canvas.add(this.currentObject);
        }
      }
    },
    handleMouseMove(e) {
      if (this.isDrawing && this.currentTool === 'line') {
        const pointer = this.canvas.getPointer(e.e);
        if (!this.currentObject) {
          this.currentObject = new fabric.LineArrow([this.startPoint.x, this.startPoint.y, pointer.x, pointer.y], {
            strokeWidth: this.objectSize / 5,
            fill: this.objectColor,
            stroke: this.objectColor,
            originX: 'center',
            originY: 'center',
            hasBorders: false,
            hasControls: false
          });
          this.canvas.add(this.currentObject);
        } else {
          this.currentObject.set({x2: pointer.x, y2: pointer.y});
        }
        this.canvas.renderAll();
      }
    },
    handleMouseUp() {
      this.isDrawing = false;
      this.startPoint = null;
      this.currentObject = null;
    },
    handleObjectModified() {
      if (this.currentObject) {
        this.canvas.discardActiveObject();
        this.currentObject = null;
      }
    },
    handleKeyDown(e) {
      // Check if the backspace or delete key was pressed
      if (e.key === 'Backspace' || e.key === 'Delete') {
        // Prevent the default action to avoid navigating back in browser or other default actions
        e.preventDefault();

        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {
          // Remove the active object from the canvas
          this.canvas.remove(activeObject);
          this.canvas.requestRenderAll();
        }
      }
    },
    drawFootballField() {
      const fieldColor = 'white';
      const lineColor = 'black';
      const lineWidth = 2;

      // Field dimensions
      const canvasWidth = this.canvas.width;
      const canvasHeight = this.canvas.height;

      // Outer boundaries
      const outerRect = new fabric.Rect({
        left: 0,
        top: 0,
        fill: fieldColor,
        stroke: lineColor,
        strokeWidth: lineWidth,
        selectable: false,
        evented: false,
        width: canvasWidth,
        height: canvasHeight
      });

      // Center circle
      const centerCircle = new fabric.Circle({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        radius: 50,
        stroke: lineColor,
        strokeWidth: lineWidth,
        fill: '',
        selectable: false,
        evented: false,
        originX: 'center',
        originY: 'center'
      });

      // Halfway line
      const halfwayLine = new fabric.Line([canvasWidth / 2, 0, canvasWidth / 2, canvasHeight], {
        stroke: lineColor,
        strokeWidth: lineWidth,
        selectable: false,
        evented: false
      });

      // Left Goal Area
      const goalAreaLeft = new fabric.Rect({
        left: 0,
        top: (canvasHeight / 2) - 90, // Adjust the position based on your canvas dimensions
        fill: '',
        stroke: lineColor,
        strokeWidth: lineWidth,
        selectable: false,
        evented: false,
        width: 60, // The width extending into the field
        height: 180 // The height of the goal area
      });

// Right Goal Area
      const goalAreaRight = new fabric.Rect({
        left: canvasWidth - 60, // Positioned at the right edge minus the goal area width
        top: (canvasHeight / 2) - 90, // Adjust the position based on your canvas dimensions
        fill: '',
        stroke: lineColor,
        strokeWidth: lineWidth,
        selectable: false,
        evented: false,
        width: 60, // The width extending into the field
        height: 180 // The height of the goal area
      });


      // Add all field elements to the canvas
      this.canvas.add(outerRect, centerCircle, halfwayLine, goalAreaLeft, goalAreaRight);
      this.canvas.sendToBack(outerRect); // Ensure the field is in the background
    },
  }
};
</script>