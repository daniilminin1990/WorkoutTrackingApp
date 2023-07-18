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
      const {
        coords: { latitude },
      } = position;
      const { longitude } = position.coords;
      const coords = [latitude, longitude];

      const map = L.map("map").setView(coords, 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      console.log(map);
      map.on("click", function (mapEvent) {
        console.log(mapEvent);
        const { lat, lng } = mapEvent.latlng;
        L.marker([lat, lng])
          .addTo(map)
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
      });
    },
    function () {
      alert("Вы не предоставили доступ к своей локации");
    }
  );

/* 
  todo 12-4 Работаем с документацией
  Поработаем с документацией, научимся ставить маркеры когда нажимаем на карту, кастомизируем popUpы

  Работать будем не с addEventListener, а с методами Leaflet
  Выведем в консоль map
  Развернем Prototype, потом еще один и там есть метод "on"
  Будем работать с ним (это из документации)
  L.marker поместим в map.on() / Зачем? потому что маркер мы хотим получить по действию. 
  Метод on находится не в самом map, а в его родителе, то есть с помощью протоипного наследования мы можем обращаться к его методам
  map.on принимает несколько параметров:
  click
  function(mapEvent)
  у mapEvent есть свои свойства, они то нам и понадобятся, там лежат координаты точки, куда нажали на карту. Мы передадим эти координаты в L.marker
  

  Теперь работает маркер по нажатию

  Теперь нужно настроить popup.
  Можно настроить через CSS (НО ЭТО МОЖЕТ НАРУШИТЬ СТАНДАРТНУЮ СТИЛИСТИКУ), а можно через встроенные методы, используя документацию API
  Мы будем делать через css


  */
