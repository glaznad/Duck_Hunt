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
	let message_block = document.querySelector('.message_block');
	let message_btn = document.querySelector('#message_btn');
	let message_text = document.querySelector('.message_text');
	let sum_text = document.querySelector('.sum_text');
	let timer_text = document.querySelector('.timer_text');
	let result_block = document.querySelector('.result_block');
	let result_sum = document.querySelector('.result_sum');

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
			sum_text.textContent = `СЧЕТ: ${sum}`;
		});
	}

	// Нажать на кнопку "СТАРТ"
	start.addEventListener('click', () => {

		start.style.display = 'none';
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
			foot.style['z-index'] = `20`;
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

		if ( !checkClass(ducks) ) {

			message = `ВСЕ УТКИ УБИТЫ. СЛЕДУЮЩИЙ РАУНД ${numberRound + 1}`;
			nextRound(message);
			
		} else {

			if (timer > 0) {
				timer_text.innerHTML = `РАУНД ${numberRound} <br> ОСТАЛОСЬ ${timer} СЕКУНД`;
				setTimeout(run, 1000, --timer);
			} else {
				message = `ВЫ НЕ ПОПАЛИ. СЛЕДУЮЩИЙ РАУНД ${numberRound + 1}`;
				nextRound(message);
			}
		}
	}

	// Окончание игры, результат
	function result () {

		for (let i = 0; i < ducks.length; i++) {
			ducks[i].className = 'duck gs';
		}

		timer_text.textContent = ``;
		sum_text.textContent = ``;
		result_block.style.display = 'block';
		result_sum.textContent = `ВАШ РЕЗУЛЬТАТ - ${sum} ОЧКОВ`;

	}

	// Следующий раунд
	function nextRound (message) {

		numberRound++;
		speed += 100;
		
		for (let i = 0; i < NUM_DUCKS; i++) {
			ducks[i].className = 'duck gs';
		}

		if (numberRound <= ROUNDS) {
			message_text.textContent = message;
			message_block.style.display = 'block';
			timer_text.textContent = ``;
		}

		message_btn.addEventListener( 'click', () => {

			message_block.style.display = 'none';
			message_text.textContent = '';

			for (let i = 0; i < ducks.length; i++) {
				duckFly(ducks[i], speed);
			};

			run(TIME_ROUNDS);

		})
		
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

		duck.classList.add('duck_fly');
		duck.style['z-index'] = `10`;

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
