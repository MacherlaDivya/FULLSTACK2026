import { useEffect, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import ChartPanel from '../components/ChartPanel';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';
import api from '../services/api';
import { exportRowsToCsv, exportSummaryToPdf } from '../services/exporters';
import { formatNumber } from '../utils/formatters';

const mergeSeries = (historical = [], forecast = []) => {
  const historyRows = historical.map((entry) => ({
    label: entry.label,
    historical: entry.value,
    forecast: null,
  }));
  const forecastRows = forecast.map((entry) => ({
    label: entry.label,
    historical: null,
    forecast: entry.predictedValue,
    confidence: entry.confidence,
  }));

  return [...historyRows, ...forecastRows];
};

const averageForecast = (forecast = []) =>
  forecast.length
    ? forecast.reduce((accumulator, entry) => accumulator + entry.predictedValue, 0) / forecast.length
    : 0;

const PredictionPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/predictions')
      .then((response) => setData(response.data.data))
      .finally(() => setLoading(false));
  }, []);

  const summary = useMemo(() => {
    if (!data) return [];

    return [
      { label: 'Energy Demand Avg Forecast', value: `${formatNumber(averageForecast(data.energyDemand.forecast))} kWh` },
      { label: 'Renewable Growth Avg Forecast', value: `${formatNumber(averageForecast(data.renewableGrowth.forecast))} MWh` },
      { label: 'CO2 Trend Avg Forecast', value: `${formatNumber(averageForecast(data.co2Trend.forecast))} t` },
    ];
  }, [data]);

  if (loading) {
    return <Loader label="Calculating predictive trends..." />;
  }

  const energySeries = mergeSeries(data.energyDemand.historical, data.energyDemand.forecast);
  const renewableSeries = mergeSeries(data.renewableGrowth.historical, data.renewableGrowth.forecast);
  const co2Series = mergeSeries(data.co2Trend.historical, data.co2Trend.forecast);

  return (
    <div className="page-stack">
      <section className="page-heading split-heading">
        <div>
          <span className="brand-eyebrow">Future Prediction Module</span>
          <h2>Forecast future demand, renewables, and emissions</h2>
          <p>
            A lightweight regression model projects short-term city trends from historical energy,
            renewable, and CO2 patterns.
          </p>
        </div>
        <div className="panel-actions">
          <button type="button" className="ghost-button" onClick={() => exportRowsToCsv(energySeries, 'energy-forecast.csv')}>
            Export CSV
          </button>
          <button
            type="button"
            className="primary-button slim"
            onClick={() =>
              exportSummaryToPdf({
                title: 'Smart City Energy Forecast',
                summary,
                tableRows: energySeries,
                fileName: 'energy-forecast.pdf',
              })
            }
          >
            Export PDF
          </button>
        </div>
      </section>

      <section className="stats-grid compact-stats">
        <StatCard title="Energy Forecast Avg" value={averageForecast(data.energyDemand.forecast)} suffix=" kWh" accent="teal" />
        <StatCard title="Renewable Forecast Avg" value={averageForecast(data.renewableGrowth.forecast)} suffix=" MWh" accent="amber" />
        <StatCard title="CO2 Forecast Avg" value={averageForecast(data.co2Trend.forecast)} suffix=" t" accent="rose" />
      </section>

      <section className="chart-grid one-col">
        <ChartPanel title="Energy Demand Forecast" subtitle="Historical monthly demand with projected continuation">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={energySeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="historical" stroke="#18b7aa" strokeWidth={3} />
              <Line type="monotone" dataKey="forecast" stroke="#ef4444" strokeDasharray="6 6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>
      </section>

      <section className="chart-grid two-col">
        <ChartPanel title="Renewable Growth Forecast" subtitle="Expected short-term clean generation growth based on observed trend">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={renewableSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="historical" stroke="#f59e0b" strokeWidth={3} />
              <Line type="monotone" dataKey="forecast" stroke="#18b7aa" strokeDasharray="6 6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="CO2 Trend Forecast" subtitle="Projected emissions path from historical city-wide totals">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={co2Series}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="historical" stroke="#ef4444" strokeWidth={3} />
              <Line type="monotone" dataKey="forecast" stroke="#8b5cf6" strokeDasharray="6 6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>
      </section>
    </div>
  );
};

export default PredictionPage;
