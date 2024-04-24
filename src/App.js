import { Line ,Doughnut} from "react-chartjs-2";
import Cards from "./Components/Cards";
import React, { useState, useEffect } from "react";
import "./App.css";
import { FaSearch } from 'react-icons/fa'

const labels = ["January", "February", "March", "April", "May", "June"];
const datasets = [
  {
    label: "My First dataset",
    backgroundColor: "rgb(255, 99, 132)",
    borderColor: "rgb(255, 99, 132)",
    data: [0, 10, 5, 2, 20, 30, 45],
  },
  {
    label: "My Second dataset",
    backgroundColor: "rgb(54, 162, 235)",
    borderColor: "rgb(54, 162, 235)",
    data: [5, 15, 10, 8, 25, 35, 50],
  },
];

  const labels2= ['Red','Blue', 'Yellow'];
  const datasets2= [
    {
    label: 'My First Dataset',
    data: [300, 50, 100],
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)'
    ],
    hoverOffset: 4
  }
]
;

const App = () => {

  const chartWidth = 500;
  const chartHeight = 300;

  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [historicalData, setHistoricalData] = useState(null);
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }
        const data = await response.json();
        const countries = data.map((country) => country.name.common);
        setSuggestions(countries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    const filteredSuggestions = suggestions.filter((country) =>
      country.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (country) => {
    setInputValue(country);
    setSuggestions([]);
  };

  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!inputValue) return; 
      try {
        const response = await fetch(
          `https://disease.sh/v3/covid-19/historical/${inputValue}?lastdays=1500`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch historical data");
        }
        const data = await response.json();
        setHistoricalData(data.timeline);
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    };

    fetchHistoricalData();
  }, [inputValue]);

  const data = {
    labels: labels,
    datasets: datasets,
  };
  let lineChartData = data;
  if (historicalData) {
    const labels = Object.keys(historicalData.cases);
    const data = Object.values(historicalData.cases);
    lineChartData = {
      labels: labels,
      datasets: [
        {
          label: "Cases",
          data: data,
          fill: false,
          borderColor: ['rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'],
          tension: 0.1,
          
        },
      ],
    };
  }
  const data2 = {
    labels: labels2,
    datasets: datasets2,
  };
  let DoughnutData = data2;
  if (historicalData) {
    const labels2 = Object.keys(historicalData.cases);
    const data = Object.values(historicalData.cases);
    DoughnutData = {
      labels: labels2,
      datasets: [
        {
          label: "Cases",
          data: data,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
          hoverOffset: 4
        },
      ],
    };
  }

  const calculateNewCases = () => {
    if (!historicalData) return [];
    const cases = Object.values(historicalData.cases);
    return cases.map((caseCount, index) =>
      index === 0 ? caseCount : caseCount - cases[index - 1]
    );
  };

  const calculateNewDeaths = () => {
    if (!historicalData) return [];
    const deaths = Object.values(historicalData.deaths);
    return deaths.map((deathCount, index) =>
      index === 0 ? deathCount : deathCount - deaths[index - 1]
    );
  };

  const calculateNewRecoveries = () => {
    if (!historicalData || !historicalData.recovered) return [];
    const recoveries = Object.values(historicalData.recovered);
    return recoveries.map((recoveryCount, index) =>
      index === 0 ? recoveryCount : recoveryCount - recoveries[index - 1]
    );
  };

  const newCases = calculateNewCases().reduce((acc, cur) => acc + cur, 0);
  const newDeaths = calculateNewDeaths().reduce((acc, cur) => acc + cur, 0);
  const newRecoveries = calculateNewRecoveries().reduce(
    (acc, cur) => acc + cur,
    0
  );

  return (
    
    <div>
      <h1 className="title">COVID-19 and Population Dashboard</h1>
      <div className='main'>
      
      <div className='input-wrapper'>
        <FaSearch className='search-icon'/>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search for a country..."
        />
         
    </div>
    <div className='input-wrapper1'>
    <select name="cars" id="cars">
    <option value="">24-10-2022-8-12-2023</option>
    <option value="saab">21-10-2022-9-12-2023</option>
    <option value="opel">25-10-2022-11-12-2023</option>
    <option value="audi">28-10-2022-8-12-2023</option>
  </select>
    </div>
        <ul className="suggestions">
          {inputValue &&
            suggestions.map((country, index) => (
              <li key={index} onClick={() => handleSuggestionClick(country)}>
                {country}
              </li>
            ))}
        </ul>
      </div>
      
      <Cards newCases = {newCases}  newRecoveries = {newRecoveries} newDeaths = {newDeaths}/>
      
      <div className="charts">
      <h4>Line Chart</h4>
      <Line data={lineChartData}  width={chartWidth}
                height={chartHeight}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }} />
         <h4>Pie Chart</h4>       
      <Doughnut  data={DoughnutData} />
    </div>
    </div>
  );
};
export default App;
