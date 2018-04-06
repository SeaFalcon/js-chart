function Chart(container, _config) {
  var config = _config;
  if (!config) {
    config = { options: {} };
  }
  this.options = {
    backgroundColor: config.options.backgroundColor || '#fff',
    width: config.options.width || 200,
    height: config.options.height || 200,
    labelFont: config.options.labelFont || 'sans-serif',
    labelSize: config.options.labelSize || '12px',
    lineWidth: config.options.lineWidth || 1
  };
  this.data = config.data || { datasets: [] };

  if (typeof container === 'string') {
    this.container = document.getElementById(container);
  } else if (container instanceof HTMLElement) {
    this.container = container;
  }

  this.canvas = document.createElement('canvas');
  this.canvas.width = this.options.width;
  this.canvas.height = this.options.height;
  this.ctx = this.canvas.getContext('2d');

  this.container.appendChild(this.canvas);
}

Chart.prototype.drawRect = function (x, y, width, height, options) {
  if (!options) options = {};
  this.ctx.beginPath();
  this.ctx.lineWidth = options.lineWidth;
  this.ctx.strokeStyle = options.strokeStyle;
  this.ctx.borderColor = options.borderColor;
  this.ctx.rect(x, y, width, height);
  this.ctx.stroke();

  if (options.backgroundColor) {
    this.ctx.fillStyle = options.backgroundColor;
    this.ctx.fillRect(x, y, width, height);
  }
};

Chart.prototype.drawText = function (text, x, y, options) {
  if (!options) options = {};
  this.ctx.font = options.font;
  this.ctx.textAlign = options.textAlign || 'center';
  this.ctx.fillStyle = options.fillStyle || '#000000';
  this.ctx.fillText(text, x, y);
};

function BarChart(ctx, config) {
  Chart.call(this, ctx, config);
  this.draw(barChart);  // 차트가 렌더링 되도록 생성자함수에서 draw호출
}

BarChart.prototype = Object.create(Chart.prototype);
BarChart.prototype.draw = function () {
  var margin = { x: 40, y: 30 }
    , barGapSize = 20
    , labels = this.data.labels;

  for (var i = 0; i < this.data.datasets.length; i++) {
    var dataset = this.data.datasets[i]
      , barNum = dataset.data.length
      , maxVal = Math.max.apply(null, dataset.data)
      , ratio = (this.canvas.height - margin.y - this.options.lineWidth) / maxVal

    for (var j = 0; j < dataset.data.length; j++) {
      var data = dataset.data[j]
        , width = (this.canvas.width - (margin.x * 2 - ((barNum - 1) * barGapSize)) / barNum)
        , height = -(data * ratio)
        , x = j * (width + barGapSize) + margin.x
        , y = this.canvas.height - margin.y
        , backgroundColor = dataset.backgroundColor[j];

      this.drawRect(x, y, width, height, { backgroundColor: backgroundColor });
      if (labels[j]) this.drawText(labels[j], x + (width / 2), this.canvas.height - 10, {
        font: this.options.labelSize + ' ' + this.options.labelFont
      });
    }
  }
};

//주석이 너무 어둡다..
var barChart = new BarChart('chart-section', {
  data: {
    labels: ['중학교', '고등학교', '대학교', '대학원'],
    datasets: [{
      data: [5, 3, 4, 8],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1
    }]
  },
  options: {
    width: 800,
    height: 600,
    labelSize: '18px'
  }
})