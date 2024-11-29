'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
//Navigator Api for fetching location
let map,popupEvent;
navigator.geolocation.getCurrentPosition(function(position){
    console.log(position);
    let {latitude}=position.coords;
    let {longitude}=position.coords;
    let coordinates=[latitude,longitude];
    map = L.map('map').setView(coordinates, 13);

L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.on('click',function(popupE){
    form.classList.remove('hidden');
    inputDistance.focus();
popupEvent=popupE;
})
},function(){
    alert(`Error in fetching the location!!`);
})
form.addEventListener('submit',function(e){
    e.preventDefault();
    inputCadence.value=inputDistance.value=inputDuration.value=inputElevation.value='';
    const {lat,lng}=popupEvent.latlng;
    L.marker([lat, lng]).addTo(map)
        .bindPopup(L.popup({
            maxWidth:200,
            maxHeight:250,
            className:'running-popup .leaflet-popup-content-wrapp',
            closeOnClick:false,
            autoClose:false
        })).bindPopup("Running")
        .openPopup();
})
inputType.addEventListener('change',function(){
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
})