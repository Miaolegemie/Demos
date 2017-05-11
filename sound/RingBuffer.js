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
