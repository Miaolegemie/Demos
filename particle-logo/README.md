# particle-logo
----------------------------------
图片转粒子外加动画

[Demo](https://miaolegemie.github.io/Demos/particle-logo/particle-logo.html)

## 配置参数

- canvas: 要在哪个 canvas 上绘制 （必填）
- image: 需要绘制的图片 url （必填）
- cols: 每列最多多少粒子 （默认为图片高度的一半）
- rows: 每行最多多少粒子 （默认为图片宽度的一半）
- startX、startY: 粒子出发位置 （仅在 `type: spray` 下生效） （默认为图片中心）
- imageHeight、imageWidth: 图片高度、宽度 （默认为图片高度、宽度）
- duration: 动画持续时间（非精准值） （默认为 1500ms）
- interval: 每个粒子出发时间的间隔 （默认为 3ms）
- ease: 缓动函数 （默认为 `easeOutBack`）
  - `linear`, `easeInOutQuad`, `easeOutQuad`, `easeInCubic`, `easeOutCubic`, `easeInOutCubic`, `easeInQuart`, `easeOutQuart`, `easeInOutQuart`, `easeInQuint`, `easeOutQuint`, `easeInOutQuint`, `easeInSine`, `easeOutSine`, `easeInOutSine`, `easeInExpo`, `easeOutExpo`, `easeInOutExpo`, `easeInCirc`, `easeOutCirc`, `easeInOutCirc`, `easeInOutElastic`, `easeInElastic`, `easeOutElastic`, `easeInOutBack`, `easeInBack`, `easeOutBack`
- range: 粒子聚集的开始范围 （仅在 `type: gather` 下生效） （默认为整个 canvas）
  - 参数形式为 `[topLeftX, topLeftY, lowerRightX, lowerRightY]`
- type: 动画模式 （默认为 `spray`）
  - spray： 从 `startX`、`startY` 喷射出
  - fadeIn: 从图片位置淡入
  - gather: 从 `range` 范围内聚集

## 示例

```javascript
<canvas id="canvas" width="800" height="800"></canvas>
<script type="text/javascript" src="particle-logo.js"></script>
<script type="text/javascript">
const particles =  new ImageToParticles({
  canvas: document.getElementById('canvas'),
  image: './py.jpg',
  imageWidth: 400,
  imageHeight: 400,
  cols: 250,
  rows: 250,
  imageX: 200,
  imageY: 200,
  duration: 500,
  type: 'gather',
  ease: 'easeInCubic',
  interval: 1,
  range: [0, 100, 800, 600]
})
</script>
```

## TODO

- [ ] 修改粒子颜色检测参数
- [ ] 错误处理
- [ ] `duration` 不确定
