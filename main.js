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

if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(function (position) {
    const {
      coords: { latitude },
    } = position;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];

    map = L.map("map").setView(coords, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    console.log(map);
    map.on(
      "click",
      function (mapE) {
        mapEvent = mapE;
        form.classList.remove("hidden");
        inputDistance.focus();
      },
      function () {
        alert("Вы не предоставили доступ к своей локации");
      }
    );

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      inputDistance.value =
        inputDuration.value =
        inputElevation.value =
        inputCadence.value =
          "";
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
  });
inputType.addEventListener("change", function (e) {
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
});

/* 
todo 12-5 Отображение формы
ui form это родной html тег у него класс hidden
Будем отображать, чтобы можно было вводить значения
Впишем это в map.on("click") перед определением координат,
а саму реализацию появления маркера по клику нужно будет потом переместить в другое место, т.к. маркер будет появляться когда будем отправлять форму
Сделаем курсор на InputDistance, когда жмякнем на карту (т.е. в map.on(click))

Для form тоже сделаем addEventListener по "submit" и сюда вставим L.marker

Но у нас остались проблемы - переменная map не глобальная, она создана в методе getCurrentPosition, соответственно ограничивается этой областью видимости и нам нужно эту переменную сделать глобальной. Вынесем ее за скобки функции

Другая проблема - у нас нет mapEvent, которая в map.on function (mapEvent). Сделаем ее глобальной тоже

У нас нет кнопки для отправки формы. Но по умолчанию при нажатии  ина Enter, форма отправляется

Отменяем стандартное поведение для form.addEventListener, чтобы страница не перезагружалась после отправки формы
И теперь все реализовано. При клике на точку на карте появляется форма, и при отправке формы, появляется маркер

Очищаем input после отправки. inputDistance = "";

У нас бег связан с высотой, а велосипед с темпом. Выбор велосипеда или бега - inputType
В HTML есть высота, скрытая hidden. И нужно ее проявлять, а темп удалять, когда меняем тип
Создадим изменение для inputType и воспользоваться событием change
Так как inputCadence и inputElevation определены как document.querySelector(".form__input--cadence"), а класс form__row--hidden находится в div form__row, который объединяет label и этот input, то нам нужно менять classList содержащий hidden, то есть div, а как это сделать, не определяя этот div?! Воспользуемся методом closest().
Этот метод возвращает ближайший родительский элемент, который соответствует заданному CSS селектору
Чтобы так сделать, нужно дописать в inputCadence.closest(".form__row").classList.toggle("....") 
*/
