var canvas = document.getElementById('myCanvas')
var context = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight - 50

var input = document.getElementById('name')
var label = document.getElementById('myLabel')
var buttonSaveScore = document.getElementById('buttonSaveScore')
var buttonPlayAgain = document.getElementById('buttonPlayAgain')
var buttonLeaderboard = document.getElementById('buttonLeaderboard')
input.style.display = 'none'
label.style.display = 'none'
buttonPlayAgain.style.display = 'none'
buttonSaveScore.style.display = 'none'
buttonLeaderboard.style.display = 'none'

var id = null
var score = 0
var noLives = 3
var scoreForLife = 1000
var playerName = ''
var numberOfAsteroids = 10
const spaceshipMovingSpeed = 3
const asteroidMovingSpeed = 6
const maximumNumberOfLasers = 3
const maximumLaserDistance = canvas.height
const laserSpeed = 300
const invulnerabilityDuration = 125
const maximumNumberOfLives = 3

function windowResize() {
	canvas.width = document.body.clientWidth
	canvas.height = document.body.clientHeight
}

window.addEventListener('resize', windowResize)

// creearea claselor pentru asteroizi si nava spatiala
class Asteroid {
	constructor(x, y, type) {
		this.x = x
		this.y = y
		this.type = type
		this.radius = this.type * 20
		this.neccesaryRockets = this.type
		this.direction = Math.floor(Math.random() * 8) + 1
		this.speed = (asteroidMovingSpeed * 10) / this.radius
		if (this.type == 4) {
			this.color = 'red'
		} else if (this.type == 3) {
			this.color = 'blue'
		} else if (this.type == 2) {
			this.color = 'yellow'
		} else if (this.type == 1) {
			this.color = 'green'
		}
	}
	draw() {
		if (this.x - this.radius > canvas.width) {
			this.x = 0 - this.radius
		}
		if (this.y - this.radius > canvas.height) {
			this.y = 0 - this.radius
		}
		if (this.x + this.radius < 0) {
			this.x = canvas.width + this.radius
		}
		if (this.y + this.radius < 0) {
			this.y = canvas.height + this.radius
		}
		if (this.neccesaryRockets != this.type) {
			this.type = this.neccesaryRockets
			this.radius = this.type * 20
		}
		context.beginPath()
		context.fillStyle = this.color
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
		context.fill()
		context.font = '15px Comic Sans Ms'
		context.fillStyle = 'white'
		context.fillText(this.neccesaryRockets, this.x, this.y)

		if (this.direction == 1) {
			this.x += this.speed
			this.y += this.speed
		} else if (this.direction == 2) {
			this.x -= this.speed
			this.y -= this.speed
		} else if (this.direction == 3) {
			this.x += this.speed
			this.y -= this.speed
		} else if (this.direction == 4) {
			this.x -= this.speed
			this.y += this.speed
		} else if (this.direction == 5) {
			this.x -= this.speed
		} else if (this.direction == 6) {
			this.y += this.speed
		} else if (this.direction == 7) {
			this.y -= this.speed
		} else if (this.direction == 8) {
			this.x += this.speed
		}
	}
}

class Spaceship {
	constructor(x, y) {
		;(this.x = x),
			(this.y = y),
			(this.orientation = Math.PI / 2),
			(this.size = 20),
			(this.rotation = 0),
			(this.movingUp = false),
			(this.movingDown = false),
			(this.movingLeft = false),
			(this.movingRight = false),
			(this.movingCoordinates = {
				x: 0,
				y: 0
			}),
			(this.collision = false),
			(this.invulnerability = false),
			(this.invulnerabilityDuration = invulnerabilityDuration),
			(this.color = 'white'),
			(this.canShot = true),
			(this.lasers = [])
	}
}

//functie pentru calcularea distantei dintre 2 puncte
function distanceBetweenPoints(x1, y1, x2, y2) {
	var xDifference = x1 - x2
	var yDifference = y1 - y2
	return Math.sqrt(xDifference * xDifference + yDifference * yDifference)
}

//functie pentru tragerea cu lasere
function laserShooting() {
	if (spaceship.lasers.length < maximumNumberOfLasers && spaceship.canShot == true) {
		laser = {
			x: spaceship.x + spaceship.size * Math.cos(spaceship.orientation),
			y: spaceship.y - spaceship.size * Math.sin(spaceship.orientation),
			movingCoordinates: {
				x: 0.02 * laserSpeed * Math.cos(spaceship.orientation),
				y: -0.02 * laserSpeed * Math.sin(spaceship.orientation)
			},
			distance: 0
		}
		spaceship.lasers.push(laser)
	}
	spaceship.canShot = false
}

function keyDown(/** @type {KeyboardEvent} */ ev) {
	switch (ev.keyCode) {
		case 90: // apasam tasta z
			spaceship.rotation = 0.05
			break
		case 67: // apasam tasta c
			spaceship.rotation = -0.05
			break
		case 38: //apasam sagetica inainte
			spaceship.movingUp = true
			break
		case 37: //apasam sagetica stanga
			spaceship.movingLeft = true
			break
		case 39: // apasam sagetica dreapta
			spaceship.movingRight = true
			break
		case 40:
			spaceship.movingDown = true
			break
		case 88:
			laserShooting()
			break
	}
}

function keyUp(/** @type {KeyboardEvent} */ ev) {
	switch (ev.keyCode) {
		case 90: // apasam tasta z
			spaceship.rotation = 0
			break
		case 67: // apasam tasta c
			spaceship.rotation = 0
			break
		case 38: //apasam sagetica inainte
			spaceship.movingUp = false
			break
		case 37: //apasam sagetica stanga
			spaceship.movingLeft = false
			break
		case 39: // apasam sagetica dreapta
			spaceship.movingRight = false
			break
		case 40:
			spaceship.movingDown = false
			break
		case 88:
			spaceship.canShot = true
			break
	}
}

//gestionarea evenimentului de apasare a tastelor
document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)

buttonPlayAgain.onclick = function () {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight - 50
	asteroidsList = []
	score = 0
	noLives = 1
	numberOfAsteroids = 5
	input.style.display = 'none'
	label.style.display = 'none'
	buttonPlayAgain.style.display = 'none'
	buttonSaveScore.style.display = 'none'
	buttonLeaderboard.style.display = 'none'

	for (var i = 0; i < numberOfAsteroids; i++) {
		var myAsteroid = new Asteroid(Math.floor(Math.random() * (canvas.width - 100)) + 100, Math.floor(Math.random() * canvas.height - 100) + 100, Math.floor(Math.random() * 4) + 1)
		asteroidsList.push(myAsteroid)
	}
	update()
}

buttonSaveScore.onclick = function () {
	playerName = input.value
	if (playerName == '') {
		playerName = 'player'
	}
	context.clearRect(0, 0, innerWidth, innerHeight)
	context.textAlign = 'center'
	context.font = '30px Comic Sans Ms'
	context.fillStyle = 'white'
	context.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 100)
	context.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2)
	context.fillText('Name: ' + playerName, canvas.width / 2, canvas.height / 2 + 100)

	var player = {
		name: playerName,
		score: score
	}

	var bestScores = []

	for (var i = 1; i <= localStorage.length; i++) {
		var auxiliaryObject = JSON.parse(localStorage.getItem('player' + i))
		bestScores.push(auxiliaryObject)
	}

	if (bestScores.length == 5) {
		for (var i = 0; i < bestScores.length; i++) {
			if (bestScores[i].score < player.score) {
				for (var j = bestScores.length - 1; j > i; j--) {
					bestScores[j] = bestScores[j - 1]
				}
				bestScores[i] = player
				break
			}
		}
	} else {
		bestScores.push(player)
	}
	bestScores.sort((a, b) => {
		return b.score - a.score
	})

	for (var i = 1; i <= bestScores.length; i++) {
		localStorage.setItem('player' + i, JSON.stringify(bestScores[i - 1]))
	}
}

buttonLeaderboard.onclick = function () {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight - 50
	context.clearRect(0, 0, canvas.width, canvas.height)
	context.beginPath()
	context.font = '30px Comic Sans Ms'
	context.fillStyle = 'white'

	var bestScores = []

	for (var i = 1; i <= localStorage.length; i++) {
		var auxiliaryObject = JSON.parse(localStorage.getItem('player' + i))
		bestScores.push(auxiliaryObject)
	}
	var aux = 30
	context.fillText('Leaderboard', canvas.width / 2 - 100, aux)
	aux += 50
	for (var i = 0; i < bestScores.length; i++) {
		context.fillText(i + 1 + '.' + bestScores[i].name + '-' + bestScores[i].score, canvas.width / 2 - 100, (aux += 50))
	}

	context.closePath()
}

var asteroidsList = []
var spaceship = new Spaceship(canvas.width / 2, canvas.height / 2)

//functia principala
function update() {
	id = requestAnimationFrame(update)
	//golirea contextului in vederea redesenarii
	context.clearRect(0, 0, canvas.width, canvas.height)

	//desenare scor si numarul de vieti pe ecran
	context.font = '30px Comic Sans Ms'
	context.fillStyle = 'white'
	context.fillText('Score: ' + score, 10, 50)
	context.fillText('Lives: ' + noLives, 10, 100)

	//desenare nava spatiala
	context.beginPath()
	context.strokeStyle = spaceship.color
	context.moveTo(
		//deplasarea contextului de la mijloc la varf
		spaceship.x + spaceship.size * Math.cos(spaceship.orientation),
		spaceship.y - spaceship.size * Math.sin(spaceship.orientation)
	)
	context.lineTo(
		//desenare linie catre stanga jos
		spaceship.x - spaceship.size * (Math.cos(spaceship.orientation) + Math.sin(spaceship.orientation)),
		spaceship.y + spaceship.size * (Math.sin(spaceship.orientation) - Math.cos(spaceship.orientation))
	)
	context.lineTo(
		// desenarea partii de jos a navei spatiale
		spaceship.x - spaceship.size * (Math.cos(spaceship.orientation) - Math.sin(spaceship.orientation)),
		spaceship.y + spaceship.size * (Math.sin(spaceship.orientation) + Math.cos(spaceship.orientation))
	)
	//unirea liniilor
	context.closePath()
	context.stroke()

	//desenare contur nava spaciala
	// context.beginPath()
	// context.strokeStyle = 'lime'
	// context.arc(spaceship.x, spaceship.y, spaceship.size, 0, 2 * Math.PI)
	// context.stroke()

	//verificare deplasare
	if (spaceship.movingUp) {
		spaceship.movingCoordinates.x = spaceshipMovingSpeed * Math.cos(spaceship.orientation)
		spaceship.movingCoordinates.y = -1 * spaceshipMovingSpeed * Math.sin(spaceship.orientation)
	} else if (spaceship.movingLeft) {
		spaceship.movingCoordinates.x = spaceshipMovingSpeed * Math.cos(spaceship.orientation + Math.PI / 2)
		spaceship.movingCoordinates.y = -1 * spaceshipMovingSpeed * Math.sin(spaceship.orientation + Math.PI / 2)
	} else if (spaceship.movingRight) {
		spaceship.movingCoordinates.x = spaceshipMovingSpeed * Math.cos(spaceship.orientation - Math.PI / 2)
		spaceship.movingCoordinates.y = -1 * spaceshipMovingSpeed * Math.sin(spaceship.orientation - Math.PI / 2)
	} else if (spaceship.movingDown) {
		spaceship.movingCoordinates.x = spaceshipMovingSpeed * Math.cos(spaceship.orientation + Math.PI)
		spaceship.movingCoordinates.y = -1 * spaceshipMovingSpeed * Math.sin(spaceship.orientation + Math.PI)
	} else {
		spaceship.movingCoordinates.x -= 0.02 * spaceship.movingCoordinates.x
		spaceship.movingCoordinates.y -= 0.02 * spaceship.movingCoordinates.y
	}

	//rotire nava spatiala
	spaceship.orientation += spaceship.rotation

	//deplasare nava
	spaceship.x += spaceship.movingCoordinates.x
	spaceship.y += spaceship.movingCoordinates.y

	//gestionare margini nava spatiala
	if (spaceship.x < 0 - spaceship.size) spaceship.x = canvas.width + spaceship.size
	else if (spaceship.x > canvas.width + spaceship.size) spaceship.x = 0 - spaceship.size
	if (spaceship.y < 0 - spaceship.size) spaceship.y = canvas.height + spaceship.size
	else if (spaceship.y > canvas.height + spaceship.size) spaceship.y = 0 - spaceship.size

	//desenarea laserelor
	for (var i = 0; i < spaceship.lasers.length; i++) {
		context.beginPath()
		context.fillStyle = '#0FFF50'
		context.arc(spaceship.lasers[i].x, spaceship.lasers[i].y, spaceship.size * 0.1, 0, 2 * Math.PI)
		context.fill()
	}

	if (spaceship.lasers.length <= maximumNumberOfLasers) {
		for (var i = 0; i < spaceship.lasers.length; i++) {
			if (spaceship.lasers[i].distance > maximumLaserDistance) {
				spaceship.lasers.splice(i, 1)
				continue
			}

			var mx = spaceship.lasers[i].movingCoordinates.x
			var my = spaceship.lasers[i].movingCoordinates.y

			spaceship.lasers[i].x += mx
			spaceship.lasers[i].y += my
			spaceship.lasers[i].distance += Math.sqrt(mx * mx + my * my)

			if (spaceship.lasers[i].x < 0) {
				spaceship.lasers[i].x = canvas.width
			} else if (spaceship.lasers[i].x > canvas.width) {
				spaceship.lasers[i].x = 0
			}
			if (spaceship.lasers[i].y < 0) {
				spaceship.lasers[i].y = canvas.height
			} else if (spaceship.lasers[i].y > canvas.height) {
				spaceship.lasers[i].y = 0
			}
		}
	}

	//verificare invurnerabilitate
	spaceship.invulnerability = spaceship.invulnerabilityDuration > 0

	// verificare coliziune intre nava spatiala si asteroizi
	if (spaceship.invulnerabilityDuration == 0) {
		spaceship.color = 'white'
		for (var i = 0; i < asteroidsList.length; i++) {
			if (distanceBetweenPoints(spaceship.x, spaceship.y, asteroidsList[i].x, asteroidsList[i].y) < spaceship.size + asteroidsList[i].radius) {
				spaceship.collision = true
				noLives--
				if (noLives == 0) {
					cancelAnimationFrame(id)
					// context.clearRect(0, 0, innerWidth, innerHeight)
					context.clearRect(0, 0, canvas.width, canvas.height)
					context.beginPath()
					context.textAlign = 'center'
					context.font = '30px Comic Sans Ms'
					context.fillStyle = 'white'
					context.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 100)
					context.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2)
					context.closePath()

					//activare butoane
					input.style.display = 'inline-block'
					label.style.display = 'inline-block'
					buttonPlayAgain.style.display = 'inline-block'
					buttonSaveScore.style.display = 'inline-block'
					buttonLeaderboard.style.display = 'inline-block'
				}
			}
		}
	} else if (spaceship.invulnerabilityDuration > 0) {
		spaceship.invulnerabilityDuration--
		spaceship.color = 'red'
	}

	// verificare coliziune intre laser si asteroizi
	for (var i = 0; i < asteroidsList.length; i++) {
		for (var j = 0; j < spaceship.lasers.length; j++) {
			if (asteroidsList.length > 0) {
				var myType = asteroidsList[i].type
				if (distanceBetweenPoints(asteroidsList[i].x, asteroidsList[i].y, spaceship.lasers[j].x, spaceship.lasers[j].y) < asteroidsList[i].radius) {
					spaceship.lasers.splice(j, 1)
					//calculare scor
					if (myType == 1) {
						score += 100
					} else if (myType == 2) {
						score += 60
					} else if (myType == 3) {
						score += 40
					} else if (myType == 4) {
						score += 20
					}

					if (myType > 1) {
						asteroidsList[i] = new Asteroid(asteroidsList[i].x, asteroidsList[i].y, myType - 1)
					} else {
						asteroidsList.splice(i, 1)
					}
				}
			}
		}
	}

	//daca aven coliziune, restartam nava spatiala
	if (spaceship.collision) {
		spaceship = new Spaceship(canvas.width / 2, canvas.height / 2)
	}

	//atata timp cat numarul de vieti este mai mare decat 0,
	//vom desena in continuare asteorizii
	if (noLives > 0) {
		for (var i = 0; i < asteroidsList.length; i++) {
			asteroidsList[i].draw()
		}
	}

	//verificam daca scorul curent a depasit pragul de scor necesar pentru cresterea vietii,
	//in caz afirmativ, este incrementat numarul de vieti
	if (score >= scoreForLife) {
		if (noLives < maximumNumberOfLives) {
			noLives++
		}
		scoreForLife += 2000
	}

	//daca numarul de asteorizi a ajuns la 0, se vor crea altii.
	if (asteroidsList.length == 0) {
		numberOfAsteroids += 2
		for (var i = 0; i < numberOfAsteroids; i++) {
			spaceship.invulnerabilityDuration = invulnerabilityDuration
			var myAsteroid = new Asteroid(Math.floor(Math.random() * (canvas.width - 100)) + 100, Math.floor(Math.random() * canvas.height - 100) + 100, Math.floor(Math.random() * 4) + 1)
			asteroidsList.push(myAsteroid)
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////////

// creare asteroizi
for (var i = 0; i < numberOfAsteroids; i++) {
	var myAsteroid = new Asteroid(Math.floor(Math.random() * (canvas.width - 100)) + 100, Math.floor(Math.random() * canvas.height - 100) + 100, Math.floor(Math.random() * 4) + 1)
	asteroidsList.push(myAsteroid)
}
update()
