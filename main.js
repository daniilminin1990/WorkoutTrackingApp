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
      const coords = [latitude, longitude];

      const map = L.map("map").setView(coords, 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker(coords)
        .addTo(map)
        .bindPopup("A pretty CSS popup.<br> Easily customizable.")
        .openPopup();
    },
    function () {
      alert("Вы не предоставили доступ к своей локации");
    }
  );

/* 
  todo 12-3 Размещаем карту на сайте
  Подключим карту на страницу, используя ссылку https://leafletjs.com/
  Вопрос - почему мы не будем подключать google или яндекс карты?
  Ответ - 
  1) потому что они доступны не во всех странах. Например Яндекс в некоторых странах не работает.
  2) Гугл карты - перед использованием нужно вводить свои банковские данные 
  Но если захочется использовать Google или Yandex API карты, то можно будет. Методология схожая
  Как подключать написано в документации

  Переходим в загрузки и смотрим какие варианты использования карты там есть Using a Hosted Version of Leaflet
  The latest stable version Leaflet is available on several CDN's - to start using it straight away, place this in the head of your HTML code:
  То есть скопируем текст, который там есть и вставим в head в HTML

  Весь этот скрипт находится на каком-то другом сайте. Это называется CDN. И этот сайт предоставляет ресурс, все данные, которые нам необходимы
  Есть другой метод - использовать npm package. Этот метод тоже там предоставлен. Это более продвинутая вещь, можно почитать документацию и использовать

  ! Вставлять скопированные ссылки будем выше, чем наши файлы. ИНАЧЕ РАБОТАТЬ НЕ БУДЕТ

  ! ВНИМАНИЕ - в html располагаем script в head, используя атрибут DEFER, он позволяет выполнять js код только тогда, когда подгрузится вся HTML страница, при этом загрузка этого скрипта будет происходить вместе с HTMl, что немного сократит время загрузки сайта

  используем defer также и для других, вставляемых файлов 

  Сохраняем, но на нашей странице карта пока не отобразилась - нужно сделать несколько настроек
  На вкладке Overview показан пример, какой код использовать, чтобы у нас отобразилась карта
  Скопируем этот код, и вставим в function(position), туда, где передадим координаты нашему браузеру

  L - некий класс, который содержит несколько методов. Один из них - map, и у него есть параметр "map", 
  Если почитать документацию, то увидим, что map это div, который содержит в HTML нашу карту. 
  Т.е. в строку const map = L.map("map").setView([51.505, -0.09], 13); нам нужно будет указать id того div, в котором хранится наша карта
  В нашем случае это div, с id="map"

  Все, теперь работает

  В консоли можем вывести "L", т.е. тот объект, который содержит методы, который предоставляет API
  Там оч много методов, которые мы можем использовать для настройки API

  Так как координаты в примере передаются в виде массива, то переведем наши координаты в массив и вставим. Также вставим в L.marker
  Второй параметр в setView - zoom
  */
