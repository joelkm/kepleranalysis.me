const { Console } = require('console');
const { parse } = require('csv-parse')
const fs = require('fs')
const prompt = require("prompt-sync")({ sigint: true });
const results = []

let userOption

let topTemp, bottomTemp, topSize, bottomSize, topPeriod, bottomPeriod

/* HABITABILITY
The habitability conditions (extracted from Paul Glister's research on planet habitability) used to filter down planets where:
- KOI disposition
- Light incidence (Between 0.36 and 1.11 asigning the Earth an incidence of 1)
- Planet radius (Inferior than 1.6 times the size of the Earth)
*/
function isHabitable(planet){
    return planet['koi_disposition'] === 'CONFIRMED' && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11 && planet['koi_prad'] < 1.6
}
function habitabilityChosen(){
    console.log('Chosen option: Habitability')
}

//Temperature
function temperatureInterval(planet, bottomTemp, topTemp){
    return planet['koi_teq'] >= bottomTemp && planet['koi_teq'] <= topTemp
}
function temperatureChosen(){
    console.log('Chosen option: Temperature')
    do{
        if(bottomTemp > topTemp) console.log("Error, the max temperature must be higher than the min temperature")
        console.log('Please enter the temperature interval (K):')
        console.log('Min temp:')
        bottomTemp = prompt()
        console.log('Max temp:')
        topTemp = prompt()
    }while(bottomTemp > topTemp)
}

//Size
function sizeInterval(planet, bottomSize, topSize){
    return planet['koi_prad'] >= bottomSize && planet['koi_prad'] <= topSize
}
function sizeChosen(){
    console.log('Chosen option: Planet size')
    do{
        if(bottomSize > topSize) console.log("Error, the max size must be higher than the min size")
        console.log('Please enter the size interval (Planet Size / Earth Size ratio, 2 being refering to planets with twice the size of the Earth):')
        console.log('Min size:')
        bottomSize = prompt()
        console.log('Max size:')
        topSize = prompt()
    }while(bottomSize > topSize)
}

//Orbital period
function orbitalPeriodInterval(planet, bottomPeriod, topPeriod){
    return planet['koi_period'] >= bottomPeriod && planet['koi_period'] <= topPeriod
}
function orbitalPeriodChosen(){
    console.log('Chosen option: Orbital period')
    do{
        if(bottomPeriod > topPeriod) console.log("Error, the max orbital period must be higher than the min orbital period")
        console.log('Please enter the orbital period interval (days):')
        console.log('Min period:')
        bottomTemp = prompt()
        console.log('Max period:')
        topTemp = prompt()
    }while(bottomPeriod > topPeriod)
}


//PROCESS
console.log(`Please, choose a filter:
1.- Habitable planets
2.- Planets inside a certain temperature interval
3.- Planets inside a certain size interval
4.- Planets inside a certain orbital period interval
`);
userOption = prompt();

switch(userOption){
    case "1":
        habitabilityChosen()
    break;
    case "2":
        temperatureChosen()
    break;
    case "3":
        sizeChosen()
    break;
    case "4":
        orbitalPeriodChosen()
    break;
}

fs.createReadStream('kepler_data.csv')
    .pipe(parse({
        comment: '#',
        columns: true,
    }))
    .on('data', (data)=>{
        switch(userOption){
            case "1":
                if(isHabitable(data)){
                    results.push(data)
                }
                break;
            case "2":
                if(temperatureInterval(data, bottomTemp, topTemp)){
                    results.push(data)
                }            break;
            case "3":
                if(sizeInterval(data, bottomSize, topSize)){
                    results.push(data)
                }
            break;
            case "4":
                if(orbitalPeriodInterval(data, bottomPeriod, topPeriod)){
                    results.push(data)
                }
            break;
        }
        
    })
    .on('error', (err)=>{
        console.log(err)
    })
    .on('end', ()=>{
        console.log(`Matching results: ${results.length}`)
        console.log(results.map((planet)=>{
            return planet['kepler_name']
        }))
    })
