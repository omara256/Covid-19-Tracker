import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from "numeral";

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            redius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0, 0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLine: {
                    display: false,
                },
                trick: {
                    //Include a dollar sign in the ticks
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    }
}

function LineGraph({ casesType = "cases", ...props }) {
    const [data, setData] = useState({});

    // https://disease.sh/v3/covid-19/historical/all?lastdays=30

    const buildChartData = (data, casesType='cases') => {
        const chartData = [];
        let lastDataPoint;

        for (let date in data.cases)  {
            if (lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
               chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];

        };
        return chartData;
    }

    useEffect(() => {
        const fetchData = async () => {
            fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then((response) => {
                return response.json();
              })
              .then((data) => {
                let chartData = buildChartData(data, casesType);
                setData(chartData);
                console.log(chartData);
            });
        }

        fetchData();
       
    },[casesType]);

    

    return (
        <div className={props.className}>
            {data?.length > 0 && (
                  <Line data={{
                    datasets: [
                        {
                            backgroundColor: "red",
                            borderColor: "#CCC",
                            data:data,
                        },
                    ],
                }} options={options} />
            )}
           
        </div>
    )
}

export default LineGraph; 
