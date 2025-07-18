import {fabric} from "fabric";

// Dotted line arrow for running paths
fabric.DottedLineArrow = fabric.util.createClass(fabric.Line, {
    type: 'dottedLineArrow',

    initialize: function(element, options) {
        options || (options = {});
        this.callSuper('initialize', element, options);
    },

    toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'));
    },

    _render: function(ctx) {
        // Set line dash for dotted effect
        ctx.setLineDash([5, 5]);
        this.callSuper('_render', ctx);
        ctx.setLineDash([]); // Reset line dash

        // do not render if width/height are zeros or object is not visible
        if (this.width === 0 || this.height === 0 || !this.visible) return;

        ctx.save();

        var xDiff = this.x2 - this.x1;
        var yDiff = this.y2 - this.y1;
        var angle = Math.atan2(yDiff, xDiff);

        ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
        ctx.rotate(angle);

        // Arrow size relative to stroke width
        const arrowWidth = this.strokeWidth * 4;
        const arrowLength = this.strokeWidth * 4;

        // Draw arrowhead
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(-arrowLength, arrowWidth / 2);
        ctx.lineTo(-arrowLength, -arrowWidth / 2);
        ctx.closePath();

        ctx.fillStyle = this.stroke;
        ctx.fill();

        ctx.restore();
    }
});

fabric.DottedLineArrow.fromObject = function(object, callback) {
    callback && callback(new fabric.DottedLineArrow([object.x1, object.y1, object.x2, object.y2], object));
};

fabric.DottedLineArrow.async = true;