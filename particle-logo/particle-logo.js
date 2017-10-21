const EASE = {
  linear(e, a, g, f) {
    return g * e / f + a
  },
  easeInOutQuad(e, a, g, f) {
    e /= f / 2
    if (e < 1) {
      return g / 2 * e * e + a
    }
    e--
    return -g / 2 * (e * (e - 2) - 1) + a
  },
  easeOutQuad(e, a, g, f) {
    e /= f
    return -g * e * (e - 2) + a
  },
  easeOutQuad(e, a, g, f) {
    e /= f
    return -g * e * (e - 2) + a
  },
  easeInCubic(e, a, g, f) {
    e /= f
    return g * e * e * e + a
  },
  easeOutCubic(e, a, g, f) {
    e /= f
    e--
    return g * (e * e * e + 1) + a
  },
  easeInOutCubic(e, a, g, f) {
    e /= f / 2
    if (e < 1) {
      return g / 2 * e * e * e + a
    }
    e -= 2
    return g / 2 * (e * e * e + 2) + a
  },
  easeInQuart(e, a, g, f) {
    e /= f
    return g * e * e * e * e + a
  },
  easeOutQuart(e, a, g, f) {
    e /= f
    e--
    return -g * (e * e * e * e - 1) + a
  },
  easeInOutQuart(e, a, g, f) {
    e /= f / 2
    if (e < 1) {
      return g / 2 * e * e * e * e + a
    }
    e -= 2
    return -g / 2 * (e * e * e * e - 2) + a
  },
  easeInQuint(e, a, g, f) {
    e /= f
    return g * e * e * e * e * e + a
  },
  easeOutQuint(e, a, g, f) {
    e /= f
    e--
    return g * (e * e * e * e * e + 1) + a
  },
  easeInOutQuint(e, a, g, f) {
    e /= f / 2
    if (e < 1) {
      return g / 2 * e * e * e * e * e + a
    }
    e -= 2
    return g / 2 * (e * e * e * e * e + 2) + a
  },
  easeInSine(e, a, g, f) {
    return -g * Math.cos(e / f * (Math.PI / 2)) + g + a
  },
  easeOutSine(e, a, g, f) {
    return g * Math.sin(e / f * (Math.PI / 2)) + a
  },
  easeInOutSine(e, a, g, f) {
    return -g / 2 * (Math.cos(Math.PI * e / f) - 1) + a
  },
  easeInExpo(e, a, g, f) {
    return g * Math.pow(2, 10 * (e / f - 1)) + a
  },
  easeOutExpo(e, a, g, f) {
    return g * (-Math.pow(2, -10 * e / f) + 1) + a
  },
  easeInOutExpo(e, a, g, f) {
    return g * (-Math.pow(2, -10 * e / f) + 1) + a
  },
  easeInCirc(e, a, g, f) {
    e /= f
    return -g * (Math.sqrt(1 - e * e) - 1) + a
  },
  easeOutCirc(e, a, g, f) {
    e /= f
    e--
    return g * Math.sqrt(1 - e * e) + a
  },
  easeInOutCirc(e, a, g, f) {
    e /= f / 2
    if (e < 1) {
      return -g / 2 * (Math.sqrt(1 - e * e) - 1) + a
    }
    e -= 2
    return g / 2 * (Math.sqrt(1 - e * e) + 1) + a
  },
  easeInOutElastic(g, e, k, j, f, i) {
    if (g == 0) {
      return e
    }
    if ((g /= j / 2) == 2) {
      return e + k
    }
    if (!i) {
      i = j * (0.3 * 1.5)
    }
    if (!f || f < Math.abs(k)) {
      f = k
      var h = i / 4
    } else {
      var h = i / (2 * Math.PI) * Math.asin(k / f)
    }
    if (g < 1) {
      return -0.5 * (f * Math.pow(2, 10 * (g -= 1)) * Math.sin((g * j - h) * (2 * Math.PI) / i)) + e
    }
    return f * Math.pow(2, -10 * (g -= 1)) * Math.sin((g * j - h) * (2 * Math.PI) / i) * 0.5 + k + e
  },
  easeInElastic(g, e, k, j, f, i) {
    if (g == 0) {
      return e
    }
    if ((g /= j) == 1) {
      return e + k
    }
    if (!i) {
      i = j * 0.3
    }
    if (!f || f < Math.abs(k)) {
      f = k
      var h = i / 4
    } else {
      var h = i / (2 * Math.PI) * Math.asin(k / f)
    }
    return -(f * Math.pow(2, 10 * (g -= 1)) * Math.sin((g * j - h) * (2 * Math.PI) / i)) + e
  },
  easeOutElastic(g, e, k, j, f, i) {
    if (g == 0) {
      return e
    }
    if ((g /= j) == 1) {
      return e + k
    }
    if (!i) {
      i = j * 0.3
    }
    if (!f || f < Math.abs(k)) {
      f = k
      var h = i / 4
    } else {
      var h = i / (2 * Math.PI) * Math.asin(k / f)
    }
    return (f * Math.pow(2, -10 * g) * Math.sin((g * j - h) * (2 * Math.PI) / i) + k + e)
  },
  easeInOutBack(e, a, h, g, f) {
    if (f == undefined) {
      f = 1.70158
    }
    if ((e /= g / 2) < 1) {
      return h / 2 * (e * e * (((f *= (1.525)) + 1) * e - f)) + a
    }
    return h / 2 * ((e -= 2) * e * (((f *= (1.525)) + 1) * e + f) + 2) + a
  },
  easeInBack(e, a, h, g, f) {
    if (f == undefined) {
      f = 1.70158
    }
    return h * (e /= g) * e * ((f + 1) * e - f) + a
  },
  easeOutBack(e, a, h, g, f) {
    if (f == undefined) {
      f = 1.70158
    }
    return h * ((e = e / g - 1) * e * ((f + 1) * e + f) + 1) + a
  }
}
class ImageToParticles {
  // { canvas, image, cols, rows, startX, startY, imageX, imageY, imageHeight, imageWidth, duration, interval, ease, range, type }
  constructor(options) {
    const image = new Image()
    image.src = options.image
    image.onload = () => {
      const defaultOptions = {
        rows: image.height / 2,
        cols: image.width / 2,
        startX: (options.imageX || 0) + (options.imageWidth || image.width) / 2,
        startY: (options.imageY || 0) + (options.imageHeight || image.height) / 2,
        imageX: 0,
        imageY: 0,
        imageWidth: image.width,
        imageHeight: image.height,
        duration: 1500,
        interval: 3,
        ease: 'easeOutBack',
        ctx: options.canvas.getContext('2d'),
        range: [0, 0, options.canvas.width, options.canvas.height],
        type:'spray'
      }
      this.options = Object.assign(defaultOptions, options)
      this.options.ctx.drawImage(image, this.options.imageX, this.options.imageY, this.options.imageWidth, this.options.imageHeight)
      this.init()
    }
  }
  init() {
    const imageData = this.options.ctx.getImageData(this.options.imageX, this.options.imageY, this.options.imageWidth, this.options.imageHeight)
    this.particles = []
    const s_width = (this.options.imageWidth / this.options.cols).toFixed(2)
    const s_height = (this.options.imageHeight / this.options.rows).toFixed(2)
    let pos = 0
    const data = imageData.data
    for (let i = 1; i <= this.options.cols; i++) {
      for (let j = 1; j <= this.options.rows; j++) {
        // R的坐标
        pos = [(parseInt(j * s_height - 1)) * this.options.imageWidth + (parseInt(i * s_width) - 1)] * 4
        // TODO: 过滤白色背景
        if (data[pos] < 240) {
          const particle = {
            x: parseInt(this.options.imageX + i * s_width + (Math.random() - 0.5) * s_width * 4),
            y: parseInt(this.options.imageY + j * s_height + (Math.random() - 0.5) * s_height * 4),
            fillStyle: this.rgbToHex(data[pos], data[pos + 1], data[pos + 2]),
            duration: parseInt((this.options.duration - 10 * this.options.interval) / 16.66) + 1, // 多少帧，为了保证持续时间为 duration
            interval: parseInt(Math.random() * 10 * this.options.interval), // 粒子间隔
            currTime: 0
          }
          if (this.options.type === 'spray') {
            particle.startX = this.options.startX
            particle.startY = this.options.startY
          } else if (this.options.type === 'fadeIn') {
            particle.startX = this.options.imageX + this.options.imageWidth * i / this.options.rows
            particle.startY = this.options.imageY + this.options.imageHeight * j / this.options.cols
          }
          this.particles.push(particle)
        }
      }
    }
    if (this.options.type === 'gather') {
      const range = this.options.range
      const len = this.particles.length
      const rect = Math.sqrt((range[2] - range[0]) * (range[3] - range[1]) / this.particles.length)
      const rows = parseInt((range[2] - range[0]) / rect)
      const cols = parseInt((range[3] - range[1]) / rect)
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const index = i * rows + j
          this.particles[index].startX = range[0] + Math.random() * (range[2] - range[0])
          this.particles[index].startY = range[1] + Math.random() * (range[3] - range[1])
        }
      }
    }
    // 钦定最后一个粒子最后出发
    this.particles[this.particles.length - 1].interval = 10 * this.options.interval
    this.render()
  }
  render() {
    let rafId = ''
    const ctx = this.options.ctx
    const len = this.particles.length
    ctx.clearRect(0, 0, this.options.canvas.width, this.options.canvas.height)
    for (let i = 0; i < len; i++) {
      const currParticle = this.particles[i]
      ctx.fillStyle = currParticle.fillStyle
      // 所有粒子执行完动画后取消动画
      if (this.particles[len - 1].duration + this.particles[len - 1].interval < this.particles[len - 1].currTime) {
        cancelAnimationFrame(rafId)
        this.draw()
        return
      } else {
        // 当前粒子仍在运动
        if (currParticle.currTime < currParticle.duration + currParticle.interval) {
          // 看看粒子是不是出发了
          if (currParticle.currTime >= currParticle.interval) {
            const time = currParticle.currTime - currParticle.interval
            const x = EASE[this.options.ease](time, currParticle.startX, currParticle.x - currParticle.startX, currParticle.duration)
            const y = EASE[this.options.ease](time, currParticle.startY, currParticle.y - currParticle.startY, currParticle.duration)
            ctx.fillRect(x, y, 1, 1)
          }
        } else {
          // 还没倒时间
          ctx.fillRect(currParticle.x, currParticle.y, 1, 1)
        }
        currParticle.currTime += Math.random() + 0.5
      }
    }
    rafId = requestAnimationFrame(this.render.bind(this))
  }
  draw() {
    const ctx = this.options.ctx
    ctx.clearRect(0, 0, this.options.canvas.width, this.options.canvas.height)
    for (let i = 0; i < this.particles.length; i++) {
      ctx.fillStyle = this.particles[i].fillStyle
      ctx.fillRect(this.particles[i].x, this.particles[i].y, 1, 1)
    }
  }
  rgbToHex(r, g, b) {
    return "#" + ("000000" + ((r << 16) | (g << 8) | b).toString(16)).slice(-6)
  }
}
