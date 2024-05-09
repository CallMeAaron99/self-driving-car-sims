import { lerp, randomNumberBetween } from "./util.js"
import Car from "./car.js"

export default class Road {
    constructor(x, width, length, laneCount = 3) {
        this.width = width
        this.laneCount = laneCount
        this.width = width
        this.left = x - width / 2
        this.right = x + width / 2
        this.length = length
        this.top = -length
        this.bottom = length

        this.boarders = [
            [{ x: this.left, y: this.top }, { x: this.left, y: this.bottom }],
            [{ x: this.right, y: this.top }, { x: this.right, y: this.bottom }]
        ]
    }

    getTraffic(startY, carWidth, carLength, maxSpeed) {
        /*
            Rules:
            1. 0 < same lane traffic count < lane count
            2. minimum gap > 3 * car length
            3. maximum gap < 5 * car length
        */
        const minGap = carLength * 3
        const maxGap = carLength * 5
        const laneIndexes = []
        for (let i = 0; i < this.laneCount; i++) laneIndexes.push(i)
        const traffic = []

        while (startY > this.top) {
            // traffic count of one lane
            const carCount = randomNumberBetween(1, this.laneCount - 1)
            let tempIndexes = laneIndexes.slice()

            for (let i = 0; i < carCount; i++) {
                const index = randomNumberBetween(0, tempIndexes.length - 1)
                traffic.push(
                    new Car(
                        this.getLaneCenter(tempIndexes.splice(index, 1)),
                        startY,
                        carWidth, carLength, "DUMMY", maxSpeed
                    )
                )
            }
            startY -= randomNumberBetween(minGap, maxGap)
        }
        return traffic
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

    update(car, traffic) {
        if (car.y - this.top < this.length / 2) {
            // New traffic y based on last traffic - 250
            const oldTop = traffic[traffic.length - 1].y - 250
            this.top -= this.length / 2
            this.bottom -= this.length / 2

            this.boarders = [
                [{ x: this.left, y: this.top }, { x: this.left, y: this.bottom }],
                [{ x: this.right, y: this.top }, { x: this.right, y: this.bottom }]
            ]

            const newTraffic = this.getTraffic(oldTop, 30, 50, 0.1)

            // Filter out the cars that are out of the road
            const filteredTraffic = traffic.filter(c => c.y < this.bottom)
            traffic.length = 0
            filteredTraffic.forEach(car => traffic.push(car))
            traffic.push(...newTraffic)
        }
    }
}

