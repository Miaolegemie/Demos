const EASE = {
	easeInOutExpo: function(e, a, g, f) {
		return g * (-Math.pow(2, -10 * e / f) + 1) + a
	}
}
class ImageToParticles {
	// { canvas, image, cols, rows, startX, startY, imageX, imageY, imageHeight, imageWidth, duration, interval, ease }
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
				duration: 2000,
				interval: 6,
				ease: 'easeInOutExpo',
				ctx: options.canvas.getContext('2d')
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
				if (data[pos] < 250) {
					const particle = {
						x: parseInt(this.options.imageX + i * s_width + (Math.random() - 0.5) * s_width * 4),
						y: parseInt(this.options.imageY + j * s_height + (Math.random() - 0.5) * s_height * 4),
						fillStyle: this.rgbToHex(data[pos], data[pos + 1], data[pos + 2]),
						duration: parseInt(this.options.duration / 16.66) + 1, // 多少帧
						interval: parseInt(Math.random() * 10 * this.options.interval), // 粒子间隔
						currTime: 0
					}
					this.particles.push(particle)
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
		const length = this.particles.length
		ctx.clearRect(0, 0, this.options.canvas.width, this.options.canvas.height)
		for (let i = 0; i < length; i++) {
			const currParticle = this.particles[i]
			ctx.fillStyle = currParticle.fillStyle
			// 所有粒子执行完动画后取消动画
			if (this.particles[length - 1].duration + this.particles[length - 1].interval < this.particles[length - 1].currTime) {
				cancelAnimationFrame(rafId)
				this.draw()
				return
			} else {
				// 当前粒子仍在运动
				if (currParticle.currTime < currParticle.duration + currParticle.interval) {
					// 看看粒子是不是出发了
					if (currParticle.currTime >= currParticle.interval) {
						const time = currParticle.currTime - currParticle.interval
						const x = EASE[this.options.ease](time, this.options.startX, currParticle.x - this.options.startX, currParticle.duration)
						const y = EASE[this.options.ease](time, this.options.startY, currParticle.y - this.options.startY, currParticle.duration)
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