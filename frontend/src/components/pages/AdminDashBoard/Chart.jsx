import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({userData}) => {
    const data = {
        labels: ['As Customer', 'As Service Provider', 'As Service Provider but does not add Service','As Service Provider but added Service'],
        datasets: [{
            data: [parseInt(userData.customers), parseInt(userData.providers),parseInt(userData.providers_no_service),parseInt(userData.providers_with_service)],
            backgroundColor: ['#6B17FF','#17A2FF' , '#185AFF','#17EBFF'],
        }],
    };

    const options = {
        responsive: true,
    };
    return <Doughnut data={data} options={options} />;
};


export default DoughnutChart;
