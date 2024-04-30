import { lerp } from "./util.js"

export default class Road {
    constructor(x, width, laneCount = 3) {
        this.width = width
        this.laneCount = laneCount
        this.width = width
        this.left = x - width / 2
        this.right = x + width / 2
        this.top = -5000
        this.bottom = 5000

        const topLeft = { x: this.left, y: this.top }
        const topRight = { x: this.right, y: this.top }
        const bottomLeft = { x: this.left, y: this.bottom }
        const bottomRight = { x: this.right, y: this.bottom }

        this.boarders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ]
    }

    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.laneCount // Width of each lane
        return this.left + laneWidth / 2 + Math.min(laneIndex, this.laneCount - 1) * laneWidth
    }

    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white"

        // Center lines
        for (let i = 1; i < this.laneCount; i++) {
            const x = lerp(this.left, this.right, i / this.laneCount)
            
            ctx.setLineDash([20, 20])
            ctx.beginPath()
            ctx.moveTo(x, this.top)
            ctx.lineTo(x, this.bottom)
            ctx.stroke()
        }

        // Edge lines
        ctx.setLineDash([])
        this.boarders.forEach(border => {
            ctx.beginPath()
            ctx.moveTo(border[0].x, border[0].y)
            ctx.lineTo(border[1].x, border[1].y)
            ctx.stroke()
        })
    }

    update(delta) {

    }
}

