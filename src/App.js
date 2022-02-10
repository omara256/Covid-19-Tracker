import { 
  FormControl, 
  Select, 
  MenuItem,
  Card,
  CardContent
} from '@material-ui/core';
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import React, { useState, useEffect } from 'react';
import Table from './Table';
import { sortData, prettyPrintStat } from './utill';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {
//  State = This is how to write varibles in react <<<<<<<<
  const [countries, setCountries] = useState([]); 
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");


  useEffect(() => {
     fetch("https://disease.sh/v3/covid-19/all").then(response => response.json()).then(data => {
        setCountryInfo(data);
     });

  }, [])

  // https://disease.sh/v3/covid-19/countries

  // UseEffect runs a pice of code
  // based on a given condition

  useEffect(() => {
    //  The code inside here will run once
    // when the component loads and not again
    // async - send a request

    const getCountriesData = async () => {
       await fetch("https://disease.sh/v3/covid-19/countries").then((response) => 
       response.json()).then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country, //UGANDA
              value: country.countryInfo.iso2 //UG, KY, USA 
            }));
              
            const sortedData = sortData(data);
              setTableData(sortedData);
              setMapCountries(data);
              setCountries(countries);
       });
    };
       
       getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
     const countryCode = event.target.value;

     const url = 
         countryCode === "worldwide"
         ? "https://disease.sh/v3/covid-19/all"
         : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

         await fetch(url).then((response) => response.json()).then((data) => {
           setCountry(countryCode);
            setCountryInfo(data);

            setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
            setMapZoom(4);
         });

  }
  console.log("Country Info >>>>", countryInfo);
       

  return (
    <div className="app">
      <div className="app__left">
          <div className="app__header">
              {/* Header */}
            <h1>COVID-19 TRACKER</h1>
                <FormControl className="app_dropdown">
                    <Select variant="outlined" onChange={onCountryChange} value={country} >
                      <MenuItem value="worldwide">Worldwide</MenuItem>

    {/* Loop though all the counties and show a dropdown list of the options */}
                      {
                        countries.map((country) => (
                          <MenuItem value={country.value}>{country.name}</MenuItem>
                        ))}

                      {/* <MenuItem value="worldwide">Worldwide</MenuItem>
                      <MenuItem value="worldwide">Option 1</MenuItem>
                      <MenuItem value="worldwide">Option 2</MenuItem>
                      <MenuItem value="worldwide">YooooooO!!</MenuItem>    */}

                    </Select>
                </FormControl>
            </div>
          {/* End of Header */}

          <div className="app__stats">
            <InfoBox
                isRed
                active={casesType === "cases"}
                onClick={e => setCasesType('cases')} 
                title="Coronavirus Cases" 
                cases={prettyPrintStat(countryInfo.todayCases)} 
                total={prettyPrintStat(countryInfo.cases)} />

            <InfoBox
                active={casesType === "recovered"}
                onClick={e => setCasesType('recovered')}
                title="Recovered" 
                cases={prettyPrintStat(countryInfo.todayRecovered)} 
                total={prettyPrintStat(countryInfo.recovered)} />

            <InfoBox
                isRed
                active={casesType === "deaths"}
                onClick={e => setCasesType('deaths')}
                title="Deaths"  
                cases={prettyPrintStat(countryInfo.todayDeaths)}   
                total={prettyPrintStat(countryInfo.deaths)}/>

                  {/* InfoBoxs title="Coronavirus cases" */}
                  {/* InfoBoxs title="Coronavirus recoveries" */}
                  {/* InfoBoxs title="Coronavirus Deaths"*/}
          </div>

          


           

            {/* Map */}
            <Map
               casesType={casesType} 
               countries={mapCountries} 
               center={mapCenter} 
               zoom={mapZoom} />
      </div>
      <Card className="app__right">
        <CardContent>

          <h3>Live Cases by Country</h3>
            {/* Table */}
            <Table countries={tableData} />
            <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
            <LineGraph className="app__graph" casesType={casesType} />
           
        </CardContent>
            
      </Card>
     

    </div>
  );
}

export default App;
