$(function () {

	const ROUNDS = 3; // число раундов
	const TIME_ROUNDS = 15; // время одного раунда
	const SUM_ROUNDS = 100; // сумма очков за убитую утку
	let sum = 0;
	let numberRound = 1;
	let speed = 200;

	let dog = document.querySelector('.dog');
	let duck1 = document.querySelectorAll('.duck')[0];
	let duck2 = document.querySelectorAll('.duck')[1];
	let wrapper = document.querySelector('.wrapper');
	let foot = document.querySelector('.foot');
	let start = document.querySelector('#start');
	let restart = document.querySelector('#restart');

	// Нажатие на кнопку "СТАРТ"
	start.addEventListener('click', () => {
		$('#start').fadeOut(1000);
		game();
	});

	// Перезагрузить игру
	restart.addEventListener('click', () => {
		location.reload();
	});

	// Игра
	function game () {
		dogWalkJump(dog);
		dog.addEventListener('animationend', () => {
			duckFly(duck1, speed);
			duckFly(duck2, speed);
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

		if ((!duck1.classList.contains('duck_fly') && !duck2.classList.contains('duck_fly'))) {
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

		duck1.className = 'duck gs';
		duck2.className = 'duck gs';

		restart.style.display = 'block';
	}

	// Следующий раунд
	function nextRound (message) {
		numberRound++;
		speed += 100;
		document.querySelector('.timer').textContent = ``;
		duck1.className = 'duck gs';
		duck2.className = 'duck gs';
		if (numberRound <= ROUNDS) {
			alert(message);
			duckFly(duck1, speed);
			duckFly(duck2, speed);
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

	// Попадание в утку
	duck1.addEventListener('click', () => {
		duck1.className = 'duck gs';
		sum += SUM_ROUNDS;
		document.querySelector('.sum').textContent = `СЧЕТ: ${sum}`;
	});
	duck2.addEventListener('click', () => {
		duck2.className = 'duck gs';
		sum += SUM_ROUNDS;
		document.querySelector('.sum').textContent = `СЧЕТ: ${sum}`;
	});
	
	// Случайное целое число в заданном интервале
	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	};

});
