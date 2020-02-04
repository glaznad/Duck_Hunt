$(function () {

	const ROUNDS = 3; // число раундов
	const TIME_ROUNDS = 15; // время одного раунда
	const SUM_ROUNDS = 100; // сумма очков за убитую утку
	const NUM_DUCKS = 3; // число уток
	let sum = 0;
	let numberRound = 1;
	let speed = 200;

	let dog = document.querySelector('.dog');
	let wrapper = document.querySelector('.wrapper');
	let foot = document.querySelector('.foot');
	let start = document.querySelector('#start');
	let restart = document.querySelector('#restart');

	// Создание уток
	for (let i = 1; i < NUM_DUCKS; i++) {
		duckCreate();
	}

	let ducks = document.querySelectorAll('.duck');

	// Попадание в уток
	for (let i = 0; i < ducks.length; i++) {
		ducks[i].addEventListener('click', () => {
			ducks[i].className = 'duck gs';
			sum += SUM_ROUNDS;
			document.querySelector('.sum').textContent = `СЧЕТ: ${sum}`;
		});
	}

	// Нажатие на кнопку "СТАРТ"
	start.addEventListener('click', () => {
		$('#start').fadeOut(1000);
		game();
	});

	// Перезагрузить игру
	restart.addEventListener('click', () => {
		location.reload();
	});

	// Создание утки
	function duckCreate () {
		let div = document.createElement('DIV');
		div.className = 'duck gs';
		wrapper.insertBefore(div, start);		
	}

	// Игра
	function game () {
		dogWalkJump(dog);
		dog.addEventListener('animationend', () => {
			for (let i = 0; i < ducks.length; i++) {
				duckFly(ducks[i], speed);
			};	
			run(TIME_ROUNDS);
		});
	};

	//Таймер
	function run (timer) {

		let message = '';

		if ( numberRound > ROUNDS ){
			result();
			return;
		}

		function checkClass (ducks) {
			let check = false;
			for (let i = 0; i < NUM_DUCKS; i++) {
				if (ducks[i].classList.contains('duck_fly')) {
					return true;
				}
			}
		}	

		if (!checkClass(document.querySelectorAll('.duck'))) {
			message = `ВСЕ УТКИ УБИТЫ. СЛЕДУЮЩИЙ РАУНД ${numberRound + 1}`;
			nextRound(message);
			run(TIME_ROUNDS);
		} else {
			if (timer > 0) {
				document.querySelector('.timer').innerHTML = `РАУНД ${numberRound} <br> ОСТАЛОСЬ ${timer} СЕКУНД`;
				setTimeout(run, 1000, --timer);
			} else {
				message = `ВЫ НЕ ПОПАЛИ. СЛЕДУЮЩИЙ РАУНД ${numberRound + 1}`;
				nextRound(message);
				run(TIME_ROUNDS);
			}
		}
	}

	// Окончание игры, результат
	function result () {
		document.querySelector('.timer').textContent = ``;
		document.querySelector('.sum').textContent = ``;
		document.querySelector('.result').style.display = 'block';
		document.querySelector('.result_sum').textContent = `Ваш результат - ${sum} очков`;
	
		for (let i = 0; i < ducks.length; i++) {
			ducks[i].className = 'duck gs';
		}

		restart.style.display = 'block';
	}

	// Следующий раунд
	function nextRound (message) {
		numberRound++;
		speed += 100;
		document.querySelector('.timer').textContent = ``;
		
		for (let i = 0; i < NUM_DUCKS; i++) {
			document.querySelectorAll('.duck').className = 'duck gs';
		}

		if (numberRound <= ROUNDS) {
			alert(message);
			for (let i = 0; i < ducks.length; i++) {
				duckFly(ducks[i], speed);
			};
		}
	}

	// Анимация собаки
	function dogWalkJump (dog) {
		dog.classList.add('dog_walk');
		dog.addEventListener('transitionend', () => {
			dog.classList.remove('dog_walk');
		 	dog.classList.add('dog_jump');
		});
	};	

	// Полет утки
	function duckFly (duck, speed) {

		foot.style['z-index'] = `10`;

		duck.classList.add('duck_fly');

		let heightSky = wrapper.clientHeight - foot.clientHeight - 70;
		let widthSky = wrapper.clientWidth - 104;

		let leftEnd = getRandomInt(0, widthSky);
		let topEnd = heightSky;

		duck.style.left = `${leftEnd}px`;
		duck.style.top = `${topEnd}px`;
		duck.style['transition-duration'] = `.001s`;

		duck.addEventListener('transitionend', () => {

			duck.className = 'duck gs duck_fly';

			let leftStart = getComputedStyle(duck).left.slice(0,-2);
			let topStart = getComputedStyle(duck).top.slice(0,-2);
			leftEnd = getRandomInt(0, widthSky);
			topEnd = getRandomInt(0, heightSky);

			let topDiff = topEnd - topStart;
			let leftDiff = leftEnd - leftStart;
			let heightDiff = Math.ceil(heightSky/4);

			if ( leftDiff >= 0 && Math.abs(topDiff) <= heightDiff ) {
				duck.classList.add('duck_fly_right');
			};
			if ( leftDiff >= 0 && Math.abs(topDiff) > heightDiff ) {
				duck.classList.add('duck_fly_top_right');
			};
			if ( leftDiff < 0 && Math.abs(topDiff) <= heightDiff ) {
				duck.classList.add('duck_fly_left');
			};
			if ( leftDiff < 0 && Math.abs(topDiff) > heightDiff ) {
				duck.classList.add('duck_fly_top_left');
			};

			// Утка летает с постоянной скоростью speed
			delay = Math.sqrt(leftDiff*leftDiff + topDiff*topDiff)/speed;
			delay = Math.ceil(delay);

			duck.style.left = `${leftEnd}px`;
			duck.style.top = `${topEnd}px`;
			duck.style['transition-duration'] = `${delay}s`;

		});
	};	
	
	// Случайное целое число в заданном интервале
	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	};

});
