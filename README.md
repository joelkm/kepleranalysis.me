# Planet Analyzer

I really like astrology, and there is a common interest on building projects using the data from Nasa's Kepler telescope, so I wanted to work on it as well.
To run the app, clone the repo, cd into the directory and run:
```
npm start
```

## The app

It is a CLI application that gets a list of the registered planets by the Kepler telescope and filters it depending on the user requirements.
The data gets parsed as a stream the CSV of the registered planets in [Kepler's website](https://www.nasa.gov/mission_pages/kepler/).

User requirements can be specified choosing between these options:
- 1: Habitable planets
- 2: Planets inside a certain temperature interval
- 3: Planets inside a certain size interval
- 4: Planets inside a certain orbital period interval

The habitability conditions (extracted from Paul Glister's research on planet habitability) used to filter down planets where:
- KOI disposition (A parameter to measure stellar disposition, explained in depth [here](https://exoplanetarchive.ipac.caltech.edu/docs/PurposeOfKOITable.html)
- Light incidence (Between 0.36 and 1.11 asigning the Earth an incidence of 1)
- Planet radius (Inferior than 1.6 times the size of the Earth)

For options 2, 3 and 4, user needs to specify a value interval to filter planets. The units used to filter planets are Kelvin for temperature, size to Earth size ratio for size and days for orbital period.
