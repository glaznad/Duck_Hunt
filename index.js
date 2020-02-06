document.addEventListener('DOMContentLoaded', () => {

	const ROUNDS = 3; // число раундов
	const TIME_ROUNDS = 15; // время одного раунда
	const SUM_ROUNDS = 100; // сумма очков за убитую утку
	const NUM_DUCKS = 3; // число уток
	let sum = 0;
	let numberRound = 1;
	let speed = 300;

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

	let audio_duck = new Audio();
	let audio_gun = new Audio();
	let audio_dog = new Audio();

	// Создание уток
	for (let i = 1; i < NUM_DUCKS; i++) {
		duckCreate();
	}

	let ducks = document.querySelectorAll('.duck');

	// Попадание в уток
	for (let i = 0; i < ducks.length; i++) {
		ducks[i].addEventListener('click', (ev) => {

			ducks[i].className = 'duck gs';
			sum += SUM_ROUNDS;
			sum_text.textContent = `СЧЕТ: ${sum}`;
			//ev.stopPropagation();
			audio_duck.src = 'assets/sounds/dead-duck-falls.mp3';
			audio_duck.loop = false;

		});
	}

	// Выстрел
	wrapper.addEventListener('click', (ev) => {

		if (ev.target.classList.contains('wrapper') || ev.target.classList.contains('sum_text') ||  ev.target.classList.contains('duck')) {
			audio_gun.src = 'assets/sounds/gun-shot.mp3';
		}

	});

	// Нажать на кнопку "СТАРТ"
	start.addEventListener('click', () => {

		hideBlock(start);
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
			audio_duck.src = 'assets/sounds/duck-quack.mp3';
			audio_duck.autoplay = true;
  			audio_duck.loop = true;
  			audio_gun.autoplay = true;
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
				message = `НЕ ВСЕ УТКИ УБИТЫ. СЛЕДУЮЩИЙ РАУНД ${numberRound + 1}`;
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
		result_block.style.display = 'flex';
		result_sum.textContent = `ВАШ РЕЗУЛЬТАТ - ${sum} ОЧКОВ`;

	}

	// Следующий раунд
	function nextRound (message) {

		numberRound++;
		speed += 200;
		audio_duck.pause();
		
		for (let i = 0; i < NUM_DUCKS; i++) {
			ducks[i].className = 'duck gs';
		}

		if (numberRound <= ROUNDS) {
			message_text.textContent = message;
			message_block.style.display = 'flex';
			timer_text.textContent = ``;
		}

		message_btn.addEventListener( 'click', () => {

			hideBlock(message_block);

			audio_duck.src = 'assets/sounds/duck-quack.mp3';
			audio_duck.loop = true;

			for (let i = 0; i < ducks.length; i++) {
				duckFly(ducks[i], speed);
			};

			run(TIME_ROUNDS);

		})
		
	}

	// Анимация собаки
	function dogWalkJump (dog) {

		dog.classList.add('dog_walk');
		audio_dog.autoplay = true;
		audio_dog.src = 'assets/sounds/hunt-intro.mp3';

		dog.addEventListener('transitionend', () => {
			audio_dog.pause();
			audio_dog.src = 'assets/sounds/dog-bark.mp3';
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

	}

	// Постепенное исчезновение кнопки
	function hideBlock (elem) {
  
		let opacity = 1;	  
		let timer = setInterval(function() {
			elem.style.opacity = opacity;
			opacity -= opacity * 0.1;
			if(opacity <= 0.1) {
				clearInterval(timer);
				elem.style.cssText = 'display: none;';
			}
		}, 30);

	}

});
