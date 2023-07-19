"use strict";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

/* 
todo 12-2 Используем Geolocation API
Уже созданы HTML, CSS, и определены нужные DOM элементы из HTML
Geolocation API позволяет пользователю предоставлять своё местоположение web-приложению, если пользователь согласится предоставить его. Из соображений конфиденциальности, у пользователя будет запрошено разрешение на предоставление информации о местоположении.
Для вызова API геолокации нужно написать
Navigator.geolocation
API геолокации может быть вызвано через Navigator.geolocation; это заставит браузер пользователя вывести уведомление с запросом для доступа к текущему местоположению. Если его одобрят, то браузер сможет предоставить доступ ко всем возможностям по работе с информацией о местонахождении (например, GPS).

Тогда разработчику станут доступны несколько разных способов получения соответствующей информации:

Geolocation.getCurrentPosition(): возвратит местоположение устройства
Geolocation.watchPosition() (en-US): зарегистрирует функцию-обработчик, которая будет вызываться автоматически каждый раз, когда местоположение изменится, возвращая новые данные.

инфа с сайта https://developer.mozilla.org/ru/docs/Web/API/Geolocation_API

Мы же напишем прям сразу navigator.geolocation.getCurrentPosition();
*/

// console.log((Date.now() + "").slice(-10));

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }
  // Метод расчета темпа
  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.calcSpeed();
  }
  // Метод расчета скорости
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

const run1 = new Running([30, -42], 5, 24, 170);
const cycling1 = new Cycling([30, -42], 26, 90, 500);

console.log(run1);
console.log(cycling1);

class App {
  _workouts = [];
  _map;
  _mapEvent;
  constructor() {
    // ЗАпуск логики приложения
    this._getPosition();

    // Обработчик события, который вызывает метод _newWorkout
    form.addEventListener("submit", this._newWorkOut.bind(this));

    // Обработчик события, который вызывает метод _toggleField
    inputType.addEventListener("change", this._toggleField.bind(this));
  }
  // Метод запроса данных о местоположении от пользователя. В случае успеха запускается функция _loadMap
  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),

        // Модальное окно, в случае отказа
        function () {
          alert("Вы не предоставили доступ к своей локации");
        }
      );
  }

  // Метод загрузки карты на страницу, в случае положительного ответа о предоставлении своих координат
  _loadMap(position) {
    const {
      coords: { latitude },
    } = position;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];

    this._map = L.map("map").setView(coords, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this._map);

    // Обработчик события нажатия по карте, который запустит метод _showForm
    this._map.on("click", this._showForm.bind(this));
  }
  // Метод отобразит форму при клике по карте
  _showForm(mapE) {
    this._mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }
  // Метод переключения типов тренировки
  _toggleField() {
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  }
  _newWorkOut(e) {
    e.preventDefault();

    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every((inp) => inp > 0);

    // Данные из форм
    const { lat, lng } = this._mapEvent.latlng; // координаты
    const type = inputType.value; // running или cycling
    const distance = +inputDistance.value; // distance
    const duration = +inputDuration.value;
    let workout;
    if (type === "running") {
      const cadence = +inputCadence.value;

      // Проверка
      if (
        // ю !Number.isFinite(distance) ||
        // ю !Number.isFinite(duration) ||
        // ю !Number.isFinite(cadence)
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      ) {
        return alert("Необходимо ввести целое положительное число");
      }
      workout = new Running([lat, lng], distance, duration, cadence);
    }

    if (type === "cycling") {
      const elevation = +inputCadence.value;

      // Проверка
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      ) {
        return alert("Необходимо ввести целое положительное число");
      }
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    this._workouts.push(workout);
    console.log(this._workouts);

    // Проверить что данные корректны, т.е. устроить валидацию (строка вместо числа, отрицательное число)

    // Если создаем пробежку, то должны создать объект пробежки

    // Если велик, то создать объект велосипед

    // Добавлять созданные новые тренировки в массив workout

    // 6 Рендер маркера тренировки на карте // отобразить маркер
    this.renderWorkMarker(workout);
  }
  renderWorkMarker(workout) {
    L.marker(workout.coords)
      .addTo(this._map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "mark-popup",
        })
      )
      .setPopupContent("workout.distance")
      .openPopup();
  }
}

// 7 Очистить поля ввода и спрятать форму
inputDistance.value =
  inputDuration.value =
  inputElevation.value =
  inputCadence.value =
    "";
console.log(this._mapEvent);

const app = new App();
app._getPosition;

// 8 Рендер списка тренировок

/* 
todo 12-8 Валидация форм
Когда будем писать что-то неправильно, будет выскакивать alert об ошибке, донастроим класс App и напишем методы
Доделаем функцию _newWorkout, которая будет рендерить все, что нам нужно
1) Данные из форм
2) Проверить что данные корректны, т.е. устроить валидацию (строка вместо числа, отрицательное число)
3) Если создаем пробежку, то должны создать объект пробежки
4) Если велик, то создать объект велосипед
5) Добавлять созданные новые тренировки в массив workout
6) Рендер маркера тренировки на карте // отобразить маркер
7) Очистить поля ввода и спрятать форму
8) Рендер списка тренировок

_newWorkOut
Создали проверку введенных данных и сократим, положим в функцию и будем вызывать во все нужные момент
Создали переменную const validInputs = воспользуемся оператором rest, чтобы собирать всевозможные аргументы, которые будут передаваться в эту функцию в виде массива
и там же использовали метод every на проверку inputs.every(inp => Number.isFinite(inp)
А в местах проверки вызовем эту функцию !validInputs(distance, duration, cadence)

Возникла проблема - если вводить отрицательное число, то все работает. А нам нельзя отрицательные вводить
Поэтому опять создали переменную function Expression c const allPositive = (...inputs) => inputs.every((inp) => inp > 0);
И используем там же, в местах проверки

Переменную с координатами перенесли наверх, потому что она понадобится нам еще в другом месте
Где Function

Перемещаем появление маркеров в отдельный метод renderWorkMarker()
*/
