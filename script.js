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
    description(){
        // prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        this.description=`${this.type[0].toUpperCase()+this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    }

}
class Running extends workouts{
    type='running';
    constructor(coords,distance,duration,cadence){
        super(coords,distance,duration);
        this.cadence=cadence;
        this.calcPace();
        this.description();
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
        this.description();
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
        this._getBrowserStorage();
        //Event Listners
        inputType.addEventListener('change',this._toggleeElevationField.bind(this));
        form.addEventListener('submit',this._newWorkout.bind(this));
containerWorkouts.addEventListener('click',this._focusOnPopUp.bind(this));
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
        this.workouts.forEach((el)=>{
            this._moveToPopup(el);
                })
    }
    _showForm(mapE){
            form.classList.remove('hidden');
            inputDistance.focus();
        this.#mapEvent=mapE;
    }
    _hideForm(){
        form.style.display='none';
        form.classList.add('hidden');
        setTimeout(()=>form.style.display='grid',1000);
    }
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
console.log(this.workouts);
//Add new object to the workout array
this.workouts.push(this.workout);
this._workoutDescription(this.workout);
this._moveToPopup(this.workout);
this._setBrowserStorage();
this._hideForm();

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
                })).bindPopup(workout.description)
                .openPopup();   

    }
    _workoutDescription(workout){
        console.log(workout);
        let html=`<li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${workout.type==='running'?'🏃‍♂️':'🚴‍♀️'}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>`
          if(workout.type==='running'){
            html+=`<div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(2)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>`
          }
          if(workout.type=='cycling'){
            html+=`<div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevation}</span>
            <span class="workout__unit">m</span>
          </div>`
          }
          form.insertAdjacentHTML('afterend',html);
    }
    _focusOnPopUp(e){
const workoutEl=e.target.closest('.workout');
if(!workoutEl) return;
const popupEl=this.workouts.find((el)=>el.id===workoutEl.dataset.id);
console.log(popupEl);
this.#map.setView(popupEl.coords,13,{
    animate:true,
    pan:{
        duration:1
    }
})
    }
    _setBrowserStorage(){
        console.log(this.workouts);
        localStorage.setItem('workout',JSON.stringify(this.workouts));
    }
    _getBrowserStorage(){
    let data=JSON.parse(localStorage.getItem('workout'));
    if(!data) return;
    this.workouts=data;
    this.workouts.forEach((el)=>{
this._workoutDescription(el);
    })
    }
    
    reset(){
        localStorage.removeItem('workout');
    }
}
let app=new App();

