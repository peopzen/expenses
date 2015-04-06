var d3 = require('d3/d3');

var ExpenseVisualization = {};
var duration = 500;
var margin = {top: 10, left: 5};
var padding = {top: 5, left: 5};

ExpenseVisualization.enter = (selection) => {
  selection.select('rect.expenseBar')
    .attr('x', 0)
    .attr('y', (d) => -d.size / 4)
    .attr('width', 0)
    .attr('height', (d) => d.size / 2)
    .attr('opacity', .5)
    .attr('fill', '#0B486B');

  selection.select('rect.expenseRect')
    .attr('x', (d) => -d.size / 2)
    .attr('y', (d) => -d.size / 2)
    .attr('rx', 3)
    .attr('ry', 3)
    .attr('width', (d) => d.size)
    .attr('height', (d) => d.size)
    .attr('fill', '#fafafa')
    .attr('stroke', '#0B486B')
    .attr('stroke-opacity', (d) => {
      return d.selected || d.highlighted ? 1 : .5;
    }).attr('stroke-width', 2);

  selection.select('rect.textBG')
    .attr('opacity', .75)
    .attr('rx', 5)
    .attr('ry', 5)
    .attr('fill', '#fafafa');

  selection.select('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '.35em')
    .attr('opacity', 0);
  
  selection
    .attr('transform', (d) => 'translate(' + d.x1 + ',' + d.y + ')');

  selection.call(ExpenseVisualization.update);
}

ExpenseVisualization.update = (selection) => {
  selection.select('rect.expenseBar')
    .transition().duration(duration)
    .attr('x', (d) => d.x1 - d.x)
    .attr('width', (d) => d.x - d.x1);

  selection.select('rect.expenseRect')
    .transition().duration(duration)
    .attr('width', (d) => d.size)
    .attr('height', (d) => d.size);

  selection.select('text')
    .each(function(d) {
      d.textWidth = this.getBBox().width + padding.left * 2;
      d.textHeight = this.getBBox().height + padding.top;
    }).transition().duration(duration)
    .attr('y', (d) => d.size / 2 + margin.top)
    .attr('opacity', (d) => {
      return d.selected || d.highlighted ? 1 : .5;
    });

  selection.select('rect.textBG')
    .transition().duration(duration)
    .attr('width', (d) => d.textWidth)
    .attr('height', (d) => d.textHeight)
    .attr('x', (d) => -d.textWidth / 2)
    .attr('y', (d) => d.size / 2 + margin.top - d.textHeight / 2);

  selection
    .transition().duration((d) => {
      return d.drag ? 0 : duration;
    }).attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')');
}

ExpenseVisualization.exit = () => {

}

ExpenseVisualization.drag = (selection, beforeDrag, onDrag, afterDrag) => {
  var draggable = false;
  var drag = d3.behavior.drag()
    .on('dragstart', () => {
      setTimeout(() => {
        draggable = true;
      }, duration);
      beforeDrag();
    }).on('drag', () => {
      if (!draggable) return;
      onDrag(d3.event.x, d3.event.y);
    }).on('dragend', () => {
      draggable = false;
      afterDrag();
    });

  selection.call(drag);
}

module.exports = ExpenseVisualization;