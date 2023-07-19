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
let map;
let mapEvent;

class App {
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
    inputDistance.value =
      inputDuration.value =
      inputElevation.value =
      inputCadence.value =
        "";
    console.log(this._mapEvent);
    const { lat, lng } = this._mapEvent.latlng;
    L.marker([lat, lng])
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
      .setPopupContent("Тренировка")
      .openPopup();
  }
}

const app = new App();
app._getPosition;

/* 
todo 12-6 Рефакторинг в синтаксис класса
Рефакторинг - превращение того кода, который мы писали в стиль классов
Создадим класс и будем переносить все наши функции в этот класс

Переделывать один стиль кода в другой не самая приятная штука

Создаем класс App
Внутри несколько технических методов, которые будут выполнять нужные нам процессы
Разделим все наши функции на отдельные
  _getPosition(){  } - будет получать позицию от наших 
  _loadMap(){} - загружает карту, когда получим позицию
  _showForm(){} - отобразит форму
  _toggleField(){} - переключит бег на велосипед
  _newWorkOut(){} - запишет новую тренировку
*/
