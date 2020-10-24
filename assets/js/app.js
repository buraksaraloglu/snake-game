class SnakeGame {
	constructor() {
		this.canvas = document.getElementById('game');
		this.context = this.canvas.getContext('2d');
		this.highscore = document.getElementById('highscore');
		this.instructions = document.getElementById('instructions');
		if (localStorage.getItem('record') === null) {
			this.record = 0;
			this.highscore.style.opacity = '0';
		} else {
			this.record = this.getLocalRecord();
			this.instructions.style.opacity = '0';
			this.highscore.style.opacity = '100';
		}

		// Canvas sizes
		this.canvas.width = 600;
		this.canvas.height = 600;

		// Grid an Tile Sizes
		this.gridSize = 20;
		this.tileCount = 30;

		// Generate a new apple each time page reloads.
		this.newApple();
		document.addEventListener('keydown', this.onkeyPress.bind(this));
	}

	init() {
		// Initial values for new game
		this.tailSize = 5;
		this.trail = [];
		this.positionX = this.positionY = 15;
		this.velocityX = this.velocityY = 0;

		// Initializing the game by setting loop.
		// Game is 15 FPS
		this.timer = setInterval(this.loop.bind(this), 1000 / 15);
	}

	randApple(max) {
		return Math.floor(Math.random() * max);
	}

	newApple() {
		// this.appleX = Math.floor(Math.random() * this.tileCount);
		// this.appleY = Math.floor(Math.random() * this.tileCount);
		this.appleX = this.randApple(this.tileCount);
		this.appleY = this.randApple(this.tileCount);
	}

	reset() {
		clearInterval(this.timer);
		this.init();
	}

	loop() {
		this.update();
		this.draw();
	}

	update() {
		// Move the snake based on x and y velocities
		this.positionX += this.velocityX;
		this.positionY += this.velocityY;

		if (this.positionX < 0) {
			this.positionX = this.tileCount - 1;
		} else if (this.positionY < 0) {
			this.positionY = this.tileCount - 1;
		} else if (this.positionX > this.tileCount - 1) {
			this.positionX = 0;
		} else if (this.positionY > this.tileCount - 1) {
			this.positionY = 0;
		}

		// Did snake step on itself?
		this.trail.forEach((t) => {
			if (this.positionX === t.positionX && this.positionY === t.positionY) {
				// If so, reset the game.
				this.reset();
			}
		});

		// Storing the snake's moving coordinates
		this.trail.push({ positionX: this.positionX, positionY: this.positionY });

		// Removing one frame by tail
		while (this.trail.length > this.tailSize) {
			this.trail.shift();
		}

		// Did snake eat an apple?
		if (this.appleX === this.positionX && this.appleY === this.positionY) {
			// If so, increase tail size:
			this.tailSize++;

			// New apple
			this.newApple();
		}
	}

	draw() {
		// Black background on canvas
		this.context.fillStyle = 'black';
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		// Current score on top left
		this.context.fillStyle = 'white';
		this.context.font = '20px Arial';
		this.context.fillText(this.tailSize - 5, 20, 40);

		// Highest score
		if (this.tailSize - 5 > this.record) {
			this.record = this.tailSize - 5;
			this.saveLocalRecord(this.record);
		}
		this.highscore.innerHTML = `Highest Score: <b>${this.record}</b>`;

		// Drawing snake
		this.context.fillStyle = 'green';
		this.trail.forEach((t) => {
			this.context.fillRect(
				t.positionX * this.gridSize,
				t.positionY * this.gridSize,
				this.gridSize - 5,
				this.gridSize - 5
			);
		});

		// Drawing apple
		this.context.fillStyle = 'red';
		this.context.fillRect(
			this.appleX * this.gridSize,
			this.appleY * this.gridSize,
			this.gridSize - 5,
			this.gridSize - 5
		);
	}

	// Local Storage
	saveLocalRecord(rec) {
		let localRecord;
		if (localStorage.getItem('record') === null) {
			localRecord = [];
		} else {
			localRecord = JSON.parse(localStorage.getItem('record'));
		}
		localRecord = rec;
		localStorage.setItem('record', JSON.stringify(localRecord));
	}

	getLocalRecord() {
		let localRecord;
		if (localStorage.getItem('record') === null) {
			localRecord = [];
		} else {
			localRecord = JSON.parse(localStorage.getItem('record'));
		}

		return localRecord;
	}

	removeInstruction() {
		this.instructions.style.opacity = '0';
		this.highscore.style.opacity = '100';
	}

	onkeyPress(e) {
		switch (e.keyCode) {
			case 37:
				// Right arrow key to move rigth
				if (this.velocityX !== 1) {
					this.velocityX = -1;
					this.velocityY = 0;
				}
				break;
			case 38:
				// Up arrow key to move up
				if (this.velocityY !== 1) {
					this.velocityX = 0;
					this.velocityY = -1;
				}
				break;
			case 39:
				// Left arrow key to move left
				if (this.velocityX !== -1) {
					this.velocityX = 1;
					this.velocityY = 0;
				}
				break;
			case 40:
				// Down arrow key to move down
				if (this.velocityY !== 1) {
					this.velocityX = 0;
					this.velocityY = 1;
				}
				break;
		}
		if (this.velocityX > 0 || this.velocityX < 0 || this.velocityY > 0 || this.velocityY < 0) {
			this.removeInstruction();
		}
	}
}

const game = new SnakeGame();
window.onload = () => game.init();
