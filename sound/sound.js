

// 环形缓冲区
function RingBuffer(maxLength) {
  this.array = [];
  this.maxLength = maxLength;
}
// 返回其中第 index 项
RingBuffer.prototype.get = function(index) {
  if (index >= this.array.length) {
    return null;
  }
  return this.array[index];
};
// 返回其中最后一项
RingBuffer.prototype.last = function() {
  if (this.array.length == 0) {
    return null;
  }
  return this.array[this.array.length - 1];
}
// 向数组末尾添加，如果添加后超出最大长度，则删除首项
RingBuffer.prototype.add = function(value) {
  // Append to the end, remove from the front.
  this.array.push(value);
  if (this.array.length >= this.maxLength) {
    this.array.splice(0, 1);
  }
};
// 获得数组长度
RingBuffer.prototype.length = function() {
  // Return the actual size of the array.
  return this.array.length;
};
// 清空数组
RingBuffer.prototype.clear = function() {
  this.array = [];
};
// 复制并返回整个数组
RingBuffer.prototype.copy = function() {
  // Returns a copy of the ring buffer.
  var out = new RingBuffer(this.maxLength);
  out.array = this.array.slice(0);
  return out;
};
// 删除数组中某几项
RingBuffer.prototype.remove = function(index, length) {
  //console.log('Removing', index, 'through', index+length);
  this.array.splice(index, length);
};

/**
 * A simple sonic encoder/decoder for [a-z0-9] => frequency (and back).
 * A way of representing characters with frequency.
 * 声波编解码器
 */


var ALPHABET = '\n abcdefghijklmnopqrstuvwxyz0123456789,.!?@*';

function SonicCoder(params) {
  params = params || {};  // 参数
  this.freqMin = params.freqMin || 18500; // 声波范围——最低频率 18500
  this.freqMax = params.freqMax || 19500; // 声波范围——最高频率 19500
  this.freqError = params.freqError || 50;  // 错误频率： 可能是误差范围
  this.alphabetString = params.alphabet || ALPHABET; // 编码表
  this.startChar = params.startChar || '^'; // 开始字符
  this.endChar = params.endChar || '$'; // 结束字符
  // Make sure that the alphabet has the start and end chars.
  this.alphabet = this.startChar + this.alphabetString + this.endChar;
}

/**
 * Given a character, convert to the corresponding frequency.
 * 给定一个字符，转换为相应的频率。
 */
SonicCoder.prototype.charToFreq = function(char) {
  // Get the index of the character.
  // 拿到下标
  var index = this.alphabet.indexOf(char);
  if (index == -1) {
    // 如果不在编码表中，出错并结束发送
    // If this character isn't in the alphabet, error out.
    console.error(char, 'is an invalid character.');
    index = this.alphabet.length - 1;
  }
  // Convert from index to frequency.
  // 将波段平均分后编码至相应频率
  var freqRange = this.freqMax - this.freqMin;
  var percent = index / this.alphabet.length;
  var freqOffset = Math.round(freqRange * percent);
  return this.freqMin + freqOffset; // 返回其对应频率
};

/**
 * Given a frequency, convert to the corresponding character.
 * 给定一个频率，转换为相应的字符。
 */
SonicCoder.prototype.freqToChar = function(freq) {
  // If the frequency is out of the range.
  // 如果超出了给定频率范围
  if (!(this.freqMin < freq && freq < this.freqMax)) {
    // If it's close enough to the min, clamp it (and same for max).
    // 如果接近最小值且在误差范围内，则修正为最小值。对最大值同理
    if (this.freqMin - freq < this.freqError) {
      freq = this.freqMin;
    } else if (freq - this.freqMax < this.freqError) {
      freq = this.freqMax;
    } else {
      // Otherwise, report error.
      // 否则则出错并返回 null
      console.error(freq, 'is out of range.');
      return null;
    }
  }
  // Convert frequency to index to char.
  var freqRange = this.freqMax - this.freqMin;
  var percent = (freq - this.freqMin) / freqRange;
  var index = Math.round(this.alphabet.length * percent); // 四舍五入
  return this.alphabet[index];
};

var State = {
  IDLE: 1, // 空闲
  RECV: 2  // 接收
};

window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;

var audioContext = new window.AudioContext()
/**
 * Extracts meaning from audio streams.
 * 从音频流中提取数据
 *
 * (assumes audioContext is an AudioContext global variable.)
 *
 * 1. Listen to the microphone. 监听麦克风
 * 2. Do an FFT on the input. 对输入做FFT
 * 3. Extract frequency peaks in the ultrasonic range. 在超声波范围内提取频率峰值
 * 4. Keep track of frequency peak history in a ring buffer. 在环形缓冲区中跟踪频率峰值历史
 * 5. Call back when a peak comes up often enough. 当高峰出现时 call back
 */
function SonicServer(params) {
  params = params || {};
  this.peakThreshold = params.peakThreshold || -65; // 峰值阈值
  this.minRunLength = params.minRunLength || 2; // 最短长度，超过该长度则被判定为成功接收
  this.coder = params.coder || new SonicCoder(params); // 编解码器
  // How long (in ms) to wait for the next character.
  this.timeout = params.timeout || 300; // 超时 ？ 等待下一个字符的时间
  this.debug = !!params.debug; // debug 模式

  this.peakHistory = new RingBuffer(16); // 峰值历史（16个长度）
  this.peakTimes = new RingBuffer(16); // 峰值出现的时间 （16个长度）

  this.callbacks = {}; // 回调

  this.buffer = '';
  this.state = State.IDLE;
  this.isRunning = false;
  this.iteration = 0;
}


/**
 * Start processing the audio stream.
 * 开始处理音频流
 */
SonicServer.prototype.start = function() {
  // Start listening for microphone. Continue init in onStream.
  // 开始收听麦克风
  var constraints = {
    audio: {
      "echoCancellation": false
    }
  };

  var getUserMedia
  console.log(navigator.mediaDevices);
  if (!navigator.mediaDevices) {
    getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  } else {
    getUserMedia = navigator.mediaDevices.getUserMedia
  }
  console.log(getUserMedia)
  getUserMedia(constraints)
  .then(this.onStream_.bind(this))
  .catch(this.onStreamError_.bind(this))
};

/**
 * Stop processing the audio stream.
 * 停止处理音频流
 */
SonicServer.prototype.stop = function() {
  this.isRunning = false;
  this.track.stop();
};
// 准备执行回调
SonicServer.prototype.on = function(event, callback) {
  if (event == 'message') {
    this.callbacks.message = callback;
  }
  if (event == 'character') {
    this.callbacks.character = callback;
  }
};
// 清除回调
SonicServer.prototype.off = function(event, callback) {
  this.callbacks = {}
};
// 切换 debug 模式
SonicServer.prototype.setDebug = function(value) {
  this.debug = value;

  var canvas = document.querySelector('canvas');
  if (canvas) {
    // Remove it.
    canvas.parentElement.removeChild(canvas);
  }
};
// 执行回调
SonicServer.prototype.fire_ = function(callback, arg) {
  if (typeof(callback) === 'function') {
    callback(arg);
  }
};

SonicServer.prototype.onStream_ = function(stream) {
  // Store MediaStreamTrack for stopping later. MediaStream.stop() is deprecated
  // See https://developers.google.com/web/updates/2015/07/mediastream-deprecations?hl=en
  this.track = stream.getTracks()[0]; // 轨道
  // Setup audio graph.
  var input = audioContext.createMediaStreamSource(stream);
  var analyser = audioContext.createAnalyser(); // 用来获取音频时间和频率数据
  input.connect(analyser);
  // Create the frequency array.
  // 频域的 FFT (快速傅里叶变换) 的大小的一半
  this.freqs = new Float32Array(analyser.frequencyBinCount); // 一个无符号长整形(unsigned long)的值, 值为fftSize的一半. 这通常等于将要用于可视化的数据值的数量.
  // Save the analyser for later.
  this.analyser = analyser;
  this.isRunning = true;
  // Do an FFT and check for inaudible peaks.
  // 进行 fft 并 检查无声波峰——循环
  this.raf_(this.loop.bind(this));
};
// 错误处理
SonicServer.prototype.onStreamError_ = function(e) {
  console.error('Audio input error:', e);
};

/**
 * Given an FFT frequency analysis, return the peak frequency in a frequency
 * 给定FFT频率分析，返回频率峰值频率
 * range.
 */
SonicServer.prototype.getPeakFrequency = function() {
  // Find where to start.
  // 找到开始的地方？
  var start = this.freqToIndex(this.coder.freqMin);
  // TODO: use first derivative to find the peaks, and then find the largest peak.
  // Just do a max over the set.
  // 找峰值——具体实现很迷
  var max = -Infinity;
  var index = -1;
  // 从 32位数组中 开始的地方到结束的地方找到最大值
  for (var i = start; i < this.freqs.length; i++) {
    if (this.freqs[i] > max) {
      max = this.freqs[i];
      index = i;
    }
  }
  // Only care about sufficiently tall peaks.
  // 当该最大值大于峰值阈值时
  if (max > this.peakThreshold) {
    // 返回频率
    return this.indexToFreq(index);
  }
  return null;
};

SonicServer.prototype.loop = function() {
  // 将当前频率数据复制到 this.freqs 中
  this.analyser.getFloatFrequencyData(this.freqs);
  // Sanity check the peaks every 5 seconds.
  if ((this.iteration + 1) % (60 * 5) == 0) {
    this.restartServerIfSanityCheckFails();
  }
  // Calculate peaks, and add them to history.
  // 计算得到当前峰值频率，并将其添加到历史中
  var freq = this.getPeakFrequency();
  // if (freq) console.log(freq);
  if (freq) {
    // 拿到对应的字符
    var char = this.coder.freqToChar(freq);
    // if (char) console.log(char);
    // DEBUG ONLY: Output the transcribed char.
    if (this.debug) {
      console.log('Transcribed char: ' + char);
    }
    this.peakHistory.add(char);
    this.peakTimes.add(new Date());
  } else {
    // If no character was detected, see if we've timed out.
    // 如果没有检测到字符，看看我们是否超时。
    var lastPeakTime = this.peakTimes.last();
    if (lastPeakTime && new Date() - lastPeakTime > this.timeout) {
      // Last detection was over 300ms ago.
      // 超时则置为空闲，意味着本次结束
      this.state = State.IDLE;
      if (this.debug) {
        console.log('Token', this.buffer, 'timed out');
      }
      // 清空峰值出现时间
      this.peakTimes.clear();
    }
  }
  // Analyse the peak history.
  // 解析历史峰值
  this.analysePeaks();
  // DEBUG ONLY: Draw the frequency response graph.
  if (this.debug) {
    this.debugDraw_();
  }
  // 如果仍然在运行，则继续循环
  if (this.isRunning) {
    this.raf_(this.loop.bind(this));
  }
  // 循环次数 +1
  this.iteration += 1;
};

SonicServer.prototype.indexToFreq = function(index) {
  var nyquist = audioContext.sampleRate / 2;
  // 返回 采样率的一半 / 频域的 FFT (快速傅里叶变换) 的大小的一半 * 下标 = 频率大小
  return nyquist / this.freqs.length * index;
};

SonicServer.prototype.freqToIndex = function(frequency) {
  // audioContext.sampleRate 采样率（每秒采样数）
  var nyquist = audioContext.sampleRate / 2; // 奈奎斯特频率 —— 避免混淆？
  // 返回 最小编码频率 / 采样率的一半 * 频域的 FFT (快速傅里叶变换) 的大小的一半
  return Math.round(frequency / nyquist * this.freqs.length);
};

/**
 * Analyses the peak history to find true peaks (repeated over several frames).
 * 分析峰值历史，找到真正的山峰（重复几帧）
 */
SonicServer.prototype.analysePeaks = function() {
  // Look for runs of repeated characters.
  // 寻找确定了的字符
  var char = this.getLastRun();
  if (!char) {
    return;
  }
  if (this.state == State.IDLE) {
    // If idle, look for start character to go into recv mode.
    // 如果空闲，寻找起始字符进入接收模式
    if (char == this.coder.startChar) {
      this.buffer = '';
      this.state = State.RECV;
    }
  } else if (this.state == State.RECV) {
    // If receiving, look for character changes.
    // 如果接收，查找字符的改变 —— 找到后放入
    if (char != this.lastChar &&
        char != this.coder.startChar && char != this.coder.endChar) {
      this.buffer += char;
      this.lastChar = char;
      // 执行关于 charater 的回调
      this.fire_(this.callbacks.character, char);
    }
    // Also look for the end character to go into idle mode.
    // 也期待结束字符进入空闲模式
    if (char == this.coder.endChar) {
      this.state = State.IDLE;
      // 执行关于 message 的回调
      this.fire_(this.callbacks.message, this.buffer);
      this.buffer = '';
    }
  }
};
// 返回确定接受的字符
SonicServer.prototype.getLastRun = function() {
  var lastChar = this.peakHistory.last();
  var runLength = 0;
  // Look at the peakHistory array for patterns like ajdlfhlkjxxxxxx$.
  // 从倒数第二个开始
  for (var i = this.peakHistory.length() - 2; i >= 0; i--) {
    var char = this.peakHistory.get(i);
    if (char == lastChar) {
      runLength += 1;
    } else {
      break;
    }
  }
  if (runLength > this.minRunLength) {
    // Remove it from the buffer.
    this.peakHistory.remove(i + 1, runLength + 1);
    return lastChar;
  }
  return null;
};

/**
 * DEBUG ONLY.
 */
SonicServer.prototype.debugDraw_ = function() {
  var canvas = document.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
  }
  canvas.width = document.body.offsetWidth;
  canvas.height = 480;
  drawContext = canvas.getContext('2d');
  // Plot the frequency data.
  for (var i = 0; i < this.freqs.length; i++) {
    var value = this.freqs[i];
    // Transform this value (in db?) into something that can be plotted.
    var height = value + 400;
    var offset = canvas.height - height - 1;
    var barWidth = canvas.width/this.freqs.length;
    drawContext.fillStyle = 'black';
    drawContext.fillRect(i * barWidth, offset, 1, 1);
  }
};

/**
 * A request animation frame shortcut. This one is intended to work even in
 * background pages of an extension.
 */
SonicServer.prototype.raf_ = function(callback) {
  var isCrx = !!(window.chrome && chrome.extension);
  if (isCrx) {
    setTimeout(callback, 1000/60);
  } else {
    requestAnimationFrame(callback);
  }
};

// 重新启动服务器，如果健全检查失败
SonicServer.prototype.restartServerIfSanityCheckFails = function() {
  // Strange state 1: peaks gradually get quieter and quieter until they stabilize around -800.
  // 奇怪的状态1：峰逐渐变得安静和安静，直到他们稳定周围- 800。
  if (this.freqs[0] < -300) {
    console.error('freqs[0] < -300. Restarting.');
    this.restart();
    return;
  }
  // Strange state 2: all of the peaks are -100. Check just the first few.
  // 奇怪的状态2：所有的峰为 -100。只检查前几个。
  var isValid = true;
  for (var i = 0; i < 10; i++) {
    if (this.freqs[i] == -100) {
      isValid = false;
    }
  }
  if (!isValid) {
    console.error('freqs[0:10] == -100. Restarting.');
    this.restart();
  }
}

SonicServer.prototype.restart = function() {
  //this.stop();
  //this.start();
  window.location.reload();
};

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
