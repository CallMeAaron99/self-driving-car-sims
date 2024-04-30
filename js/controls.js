export default class Controls {
    constructor(type) {
        this.forward = false
        this.left = false
        this.right = false
        this.reverse = false

        switch (type) {
            case "KEYS":
                this.#addKeyboardListeners()
                break
            case "DUMMY":
                this.forward = true
                break
        }
    }

    #addKeyboardListeners() {
        document.addEventListener("keydown", e => {
            switch (e.key) {
                case "w":
                case "W":
                case "ArrowUp":
                    this.forward = true
                    break
                case "a":
                case "A":
                case "ArrowLeft":
                    this.left = true
                    break
                case "s":
                case "S":
                case "ArrowDown":
                    this.reverse = true
                    break
                case "d":
                case "D":
                case "ArrowRight":
                    this.right = true
                    break
            }
        })

        document.addEventListener("keyup", e => {
            switch (e.key) {
                case "w":
                case "W":
                case "ArrowUp":
                    this.forward = false
                    break
                case "a":
                case "A":
                case "ArrowLeft":
                    this.left = false
                    break
                case "s":
                case "S":
                case "ArrowDown":
                    this.reverse = false
                    break
                case "d":
                case "D":
                case "ArrowRight":
                    this.right = false
                    break
            }
        })
    }
}