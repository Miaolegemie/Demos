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
