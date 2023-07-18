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
if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      console.log(position); // Если нажали "Сообщить", то вот это GeolocationPosition {coords: GeolocationCoordinates, timestamp: 1689683718243}
      // Запишем координаты;
      const {
        coords: { latitude },
      } = position;
      console.log(latitude); // Записал через деструктуризацию объекта
      // const latitude = position.coords.latitude;
      // или так
      const { longitude } = position.coords;
      console.log(latitude, longitude);
      // А теперь откроем карту гугл и по координатам найдем местоположение, скопируем ссылку и вставим наши переменные, выведем в консоль
      console.log(`https://www.google.com/maps/@${latitude},${longitude}`); // В консоли отобразилась ссылка на мое местоположение,
    },
    function () {
      alert("Вы не предоставили доступ к своей локации");
    }
  );
