import { Visualizer } from "./visualizer.js"
import Car from "./car.js"
import Road from "./road.js"
import { NerualNetwork } from "./network.js"

const carCanvas = document.getElementById("carCanvas")
const networCanvas = document.getElementById("networkCanvas")

carCanvas.width = 200
carCanvas.height = window.innerHeight
networCanvas.width = 300
networCanvas.height = window.innerHeight

const carCtx = carCanvas.getContext("2d")
const networkCtx = networCanvas.getContext("2d")

const N = 1
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 10000)
const cars = genereateCars(N)
let traffic = road.getTraffic(-100, 30, 50, 0.1)

const saveBtn = document.querySelector("[data-save]")
const discardBtn = document.querySelector("[data-discard]")
saveBtn.addEventListener("click", save)
discardBtn.addEventListener("click", discard)

let bestCar = cars[0]
if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"))
        if (i !== 0) {
            NerualNetwork.mutate(cars[i].brain, 0.1)
        }
    }
}

let lastUpdate = null

window.addEventListener("resize", () => {
    carCanvas.height = window.innerHeight
    networCanvas.height = window.innerHeight
})

function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain))
}

function discard() {
    localStorage.removeItem("bestBrain")
}

function genereateCars(N) {
    const cars = []
    for (let i = 0; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
    }
    return cars
}

function update(time) {
    if (lastUpdate == null) {
        lastUpdate = time
        window.requestAnimationFrame(update)
        return
    }
    bestCar = cars.find(c => c.y === Math.min(
        ...cars.map(c => c.y)
    ))

    carCtx.clearRect(0, 0, carCanvas.width, carCanvas.height)
    networkCtx.clearRect(0, 0, networCanvas.width, networCanvas.height)

    carCtx.save()
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7)

    const delta = time - lastUpdate

    road.update(bestCar, traffic)
    road.draw(carCtx)

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(delta, road.boarders, [])
        traffic[i].draw(carCtx, "red")
    }

    carCtx.globalAlpha = 0.2
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(delta, road.boarders, [])
        cars[i].draw(carCtx, "blue")
    }
    carCtx.globalAlpha = 1
    bestCar.draw(carCtx, "blue", true)

    carCtx.restore()

    networkCtx.lineDashOffset = - time / 50
    Visualizer.drawNetwork(networkCtx, bestCar.brain)

    lastUpdate = time
    window.requestAnimationFrame(update)
}

window.requestAnimationFrame(update)