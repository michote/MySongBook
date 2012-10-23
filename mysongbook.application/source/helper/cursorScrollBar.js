enyo.kind({
  name: "cursorScrollBar", 
  kind: enyo.Control,
  nodeTag: "canvas",
  canvas: "",
  context: "",
  domAttributes: { 
    width: "20px"
  },
  ms8: 0,
  eighthCycle: 0,
  start: 0,
  counterTime: 0,
  elapsed: 0,
  timer: 0,
  published: {
    color: "#D4D7AC",
    onColor: "#434437",
    offColor: "#D4D7AC",
    cursorRow: 10
  },
  create: function() {
    this.inherited(arguments);
  },
  drawCanvas: function() {
    this.context.fillStyle=this.color;
    this.context.beginPath();
    this.context.arc(13,this.cursorRow,6,1.23,5.05,true);
    this.context.lineTo(0,this.cursorRow-11);
    this.context.lineTo(0,this.cursorRow+11);
    this.context.closePath();
    this.context.fill();
  },
  rendered: function() {
    this.hasNode();    
    this.canvas = this.node;
    this.context = this.canvas.getContext('2d');    
    this.drawCanvas();
  },
  colorChanged: function() {
    this.drawCanvas();
  },
  clearCursor: function() {
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.clearBpmTimer();
  },
  setY: function(Y) {
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.cursorRow = Y;
    this.drawCanvas();
  },
  cursorOn: function () {
    this.color = this.onColor;
  },
  cursorOff: function () {
    this.color = this.offColor;
  },
  timeoutInstance: function () {
    this.counterTime += this.ms8;
    this.eighthCycle = (this.eighthCycle + 1) % 8;
    this.color = this.offColor;
    if (this.eighthCycle < 2) { //  flash on for 2/8 of cycle
      this.color = this.onColor;
    }
    var diff = (new Date().getTime() - this.start) - this.counterTime;
    var _this = this;
    this.timer = window.setTimeout(function() {_this.timeoutInstance();}, this.mss8 - diff);
  },

  setBpmTimer: function(bpm) {
    this.ms8 = 7500/bpm;    // ms for 1/8 of beat
    this.eighthCycle = 0;
    this.start = new Date().getTime();
    this.counterTime = 0;
    this.elapsed = 0;
    var _this = this;
    this.timer = window.setTimeout(function() {_this.timeoutInstance();}, this.ms8);
  },
  clearBpmTimer: function() {
    window.clearTimeout(this.timer);
  }
});
