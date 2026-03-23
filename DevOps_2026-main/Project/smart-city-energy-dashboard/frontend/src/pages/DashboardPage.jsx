import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import AlertBanner from '../components/AlertBanner';
import ChartPanel from '../components/ChartPanel';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';
import api from '../services/api';

const pieColors = ['#18b7aa', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444'];

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [cityDemand, setCityDemand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [summaryResponse, demandResponse] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/city-demand'),
        ]);
        setSummary(summaryResponse.data.data);
        setCityDemand(demandResponse.data.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="page-error">{error}</div>;
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <span className="brand-eyebrow">Dashboard Overview</span>
          <h2>City scale energy monitoring</h2>
          <p>
            The dashboard consolidates building system demand, renewable energy contribution, and
            carbon emissions into a research-inspired urban operations view.
          </p>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard title="Total City Energy" value={summary.cards.totalCityEnergyConsumptionKwh} suffix=" kWh" accent="teal" />
        <StatCard title="Renewable Generation" value={summary.cards.renewableGenerationMwh} suffix=" MWh" accent="amber" />
        <StatCard title="CO2 Emissions" value={summary.cards.co2EmissionsTonnes} suffix=" t" accent="rose" />
        <StatCard title="Buildings Monitored" value={summary.cards.totalBuildingsMonitored} accent="blue" />
        <StatCard title="Renewable Share" value={summary.cards.renewableEnergyPercentage} suffix="%" accent="violet" />
        <StatCard title="Fuel Based Electricity" value={summary.cards.fuelBasedElectricityUsageKwh} suffix=" kWh" accent="slate" />
      </section>

      <AlertBanner alerts={summary.alerts} />

      <section className="chart-grid two-col">
        <ChartPanel
          title="Energy Consumption Trend"
          subtitle="Last 30 days aggregated across the monitored city building network"
        >
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={summary.energyTrend}>
              <defs>
                <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18b7aa" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#18b7aa" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" hide />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="totalKwh" stroke="#18b7aa" fill="url(#energyFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          title="Renewable Generation Mix"
          subtitle="Solar, wind, hydro, nuclear, and non-renewable contribution"
        >
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={summary.renewableMix} dataKey="value" nameKey="label" innerRadius={70} outerRadius={110} paddingAngle={3}>
                {summary.renewableMix.map((entry, index) => (
                  <Cell key={entry.label} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartPanel>
      </section>

      <section className="chart-grid three-col">
        <ChartPanel title="Building Type Distribution" subtitle="Monitored building inventory by urban function">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={summary.buildingTypes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="CO2 Emission Structure" subtitle="Operational emissions split by contributing source">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={summary.co2Breakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Density Energy Analysis" subtitle="Average energy load by population and building density index">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cityDemand?.densityAnalysis || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="densityBucket" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="averageKwh" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </section>

      <section className="chart-grid one-col">
        <ChartPanel title="City Energy Demand by Building Type" subtitle="Aggregate building demand for residential, commercial, industrial, and public assets">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={cityDemand?.demandByBuildingType || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalKwh" fill="#0f766e" radius={[8, 8, 0, 0]} />
              <Bar dataKey="averagePeakDemandKw" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </section>
    </div>
  );
};

export default DashboardPage;
