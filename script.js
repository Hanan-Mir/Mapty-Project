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
class workouts{
    date=new Date();
    id=(Date.now()+'').slice(-10);
    constructor(coords,distance,duration){
        this.coords=coords;
        this.distance=distance;
        this.duration=duration;
    }
}
class Running extends workouts{
    type='running';
    constructor(coords,distance,duration,cadence){
        super(coords,distance,duration);
        this.cadence=cadence;
        this.calcPace();
    }
    calcPace(){
        this.pace=this.duration/this.distance;
        return this.pace;
    }
}
class Cycling extends workouts{
    type='cycling';
    constructor(coords,distance,duration,elevation){
        super(coords,distance,duration);
        this.elevation=elevation;
        this.calcSpeed();
    }
calcSpeed(){
    this.speed=this.distance/this.duration/60;
    return this.speed;
}
}
console.log( new Running([120,60],400,30,100));
console.log(new Cycling([120,60],400,30,100));
///////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////
//Application Architecture
class App{
    #map;
    #mapEvent;
    #coordinates;
    workouts=[];
    workout;
    constructor(){
        this._getPosition();
        this._showForm.bind(this);
        this._toggleeElevationField.bind(this);
        //Event Listners
        inputType.addEventListener('change',this._toggleeElevationField.bind(this));
        form.addEventListener('submit',this._newWorkout.bind(this));

    }
    _getPosition(){
        navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),function(){
            alert(`Error in fetching the location!!`);
        })
    }
    _loadMap(position){
        let {latitude}=position.coords;
        let {longitude}=position.coords;
       this.#coordinates=[latitude,longitude];
       this.#map = L.map('map').setView(this.#coordinates, 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.#map); 
    this.#map.on('click',this._showForm.bind(this));
    }
    _showForm(mapE){
            form.classList.remove('hidden');
            inputDistance.focus();
        this.#mapEvent=mapE;
    }
    _hideForm(){}
    _toggleeElevationField(){
            inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
            inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }
    _newWorkout(e){
e.preventDefault();
//Get the data from form
let type=inputType.value;
let distance=+inputDistance.value;
let duration=+inputDuration.value;
let cadence=+inputCadence.value;
let elevation=+inputElevation.value;
let {lat,lng}=this.#mapEvent.latlng;
console.log(type);
//check if the data is valid
const checkValid=(...value)=>value.every((el)=> Number.isFinite(el));
const checkPositive=(...value)=>value.every(el=>el>0?true:false);
//if workout running, create running object
if(type==='running'){
if(checkValid(distance,duration,cadence)&&checkPositive(distance,duration,cadence)){
    this.workout=new Running({lat,lng},distance,duration,cadence);
}else{
    alert("Enter a valid Number")
}
}
//if workout cycling, create cycling object
if(type==='cycling'){
if(checkValid(distance,duration,cadence)&&checkPositive(distance,duration)){
   this.workout=new Cycling([lat,lng],distance,duration,cadence);
}else{
    alert("Enter a valid Number")
}
}
console.log(this.workout);
//Add new object to the workout array
this.workouts.push(this.workout);
this._moveToPopup(this.workout);
    }
    _moveToPopup(workout){
            inputCadence.value=inputDistance.value=inputDuration.value=inputElevation.value='';
            const wType=(workout.type[0]).toUpperCase()+workout.type.slice(1);
            L.marker(workout.coords).addTo(this.#map)
                .bindPopup(L.popup({
                    maxWidth:200,
                    maxHeight:250,
                    className:`${workout.type}-popup .leaflet-popup-content-wrapp`,
                    closeOnClick:false,
                    autoClose:false
                })).bindPopup(wType)
                .openPopup();   

    }
    reset(){}
}
let app=new App();

