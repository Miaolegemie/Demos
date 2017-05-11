

/**
 * Encodes text as audio streams.
 * 将文本编码为音频流
 *
 * 1. Receives a string of text. 接收一串文本
 * 2. Creates an oscillator. 创建振荡器
 * 3. Converts characters into frequencies. 将字符转换成频率
 * 4. Transmits frequencies, waiting in between appropriately. 传输频率，适当地等待
 */
function SonicSocket(params) {
  params = params || {};
  this.coder = params.coder || new SonicCoder(); // 编码器
  this.charDuration = params.charDuration || 0.2; // 传输等待时间
  this.coder = params.coder || new SonicCoder(params); // 带参数的编码器？？？
  this.rampDuration = params.rampDuration || 0.001; // 入睡前等待时间？？？
}

var audioContext = new AudioContext()
SonicSocket.prototype.send = function(input, opt_callback) {
  // Surround the word with start and end characters.
  input = this.coder.startChar + input + this.coder.endChar;
  // Use WAAPI to schedule the frequencies.
  for (var i = 0; i < input.length; i++) {
    var char = input[i];
    var freq = this.coder.charToFreq(char); // 编码成为频率
    var time = audioContext.currentTime + this.charDuration * i;
    this.scheduleToneAt(freq, time, this.charDuration);
  }

  // If specified, callback after roughly the amount of time it would have taken to transmit the token.
  // 如果有回调，则在发送完成后执行
  if (opt_callback) {
    var totalTime = this.charDuration * input.length;
    setTimeout(opt_callback, totalTime * 1000);
  }
};
// 播放固定频率音频
SonicSocket.prototype.scheduleToneAt = function(freq, startTime, duration) {
  var gainNode = audioContext.createGain(); // 可用于控制音频图形的整体增益（或音量）
  // Gain => Merger
  gainNode.gain.value = 0;

  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(1, startTime + this.rampDuration);
  gainNode.gain.setValueAtTime(1, startTime + duration - this.rampDuration);
  gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

  gainNode.connect(audioContext.destination); // 连接到扬声器（音频设备）

  var osc = audioContext.createOscillator(); // 一个表示周期波形的源。它基本上产生一个恒定的音调。
  osc.frequency.value = freq;
  osc.connect(gainNode);

  osc.start(startTime);
};
