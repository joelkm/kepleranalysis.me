const { parse } = require('csv-parse')
const fs = require('fs')
const results = []

let userOption = 1
let factor

/* HABITABILITY
The habitability conditions (extracted from Paul Glister's research on planet habitability) used to filter down planets where:
- KOI disposition
- Light incidence (Between 0.36 and 1.11 asigning the Earth an incidence of 1)
- Planet radius (Inferior than 1.6 times the size of the Earth)
*/
function isHabitable(planet){
    return planet['koi_disposition'] === 'CONFIRMED' && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11 && planet['koi_prad'] < 1.6
}

function temperatureInterval(bottomTemp, topTemp){
    return planet['koi_teq'] >= bottomTemp && planet['koi_teq'] <= topTemp
}

switch(userOption){
    case 1:
        factor = isHabitable
        console.log('Option chose: Habitability')
    break;
    case 2:
        factor = temperatureInterval
        console.log('Option chose: Habitability')
        do{
            if(bottomTemp > topTemp) console.log("Error, the superior temperature can't be lower than the bottom temperature")
            console.log('Please enter the temperature interval')
        }while(bottomTemp > topTemp)
    break;
    case 3:
        factor = isHabitable
        console.log('Option chose: Habitability')
    break;
    case 4:
    break;
}

fs.createReadStream('kepler_data.csv')
    .pipe(parse({
        comment: '#',
        columns: true,
    }))
    .on('data', (data)=>{
        if(factor(data)){
            results.push(data)
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
