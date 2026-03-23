import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import ChartPanel from '../components/ChartPanel';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import Loader from '../components/Loader';
import api from '../services/api';
import { exportRowsToCsv, exportSummaryToPdf } from '../services/exporters';
import { formatNumber } from '../utils/formatters';

const comparisonColors = ['#18b7aa', '#ef4444'];

const EnergyAnalyticsPage = () => {
  const [filters, setFilters] = useState({
    granularity: 'daily',
    year: new Date().getFullYear().toString(),
    month: '',
    buildingId: '',
  });
  const [buildings, setBuildings] = useState([]);
  const [energy, setEnergy] = useState(null);
  const [renewable, setRenewable] = useState(null);
  const [co2, setCo2] = useState(null);
  const [cityDemand, setCityDemand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/buildings').then((response) => setBuildings(response.data.data)).catch(() => setBuildings([]));
  }, []);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      setError('');
      try {
        const [energyResponse, renewableResponse, co2Response, cityDemandResponse] = await Promise.all([
          api.get('/energy-consumption', { params: filters }),
          api.get('/renewable-energy', { params: filters }),
          api.get('/co2-emissions', { params: filters }),
          api.get('/dashboard/city-demand', { params: filters }),
        ]);

        setEnergy(energyResponse.data.data);
        setRenewable(renewableResponse.data.data);
        setCo2(co2Response.data.data);
        setCityDemand(cityDemandResponse.data.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [filters]);

  const exportSummary = useMemo(
    () => [
      { label: 'Records', value: energy?.series?.length || 0 },
      { label: 'Renewable Contribution', value: `${renewable?.summary?.contributionPercentage || 0}%` },
      { label: 'CO2 Total', value: `${formatNumber(co2?.summary?.totalTonnes || 0)} t` },
    ],
    [co2?.summary?.totalTonnes, energy?.series?.length, renewable?.summary?.contributionPercentage]
  );

  if (loading) {
    return <Loader label="Loading analytics modules..." />;
  }

  if (error) {
    return <div className="page-error">{error}</div>;
  }

  return (
    <div className="page-stack">
      <section className="page-heading split-heading">
        <div>
          <span className="brand-eyebrow">Analytics Center</span>
          <h2>Energy, renewable, and emissions analysis</h2>
          <p>
            Filter daily, monthly, and yearly data to compare building-level demand with city-wide
            renewable production and carbon outcomes.
          </p>
        </div>
        <div className="panel-actions">
          <button
            type="button"
            className="ghost-button"
            onClick={() => exportRowsToCsv(energy?.series || [], 'energy-analytics.csv')}
          >
            Export CSV
          </button>
          <button
            type="button"
            className="primary-button slim"
            onClick={() =>
              exportSummaryToPdf({
                title: 'Smart City Energy Analytics',
                summary: exportSummary,
                tableRows: energy?.series || [],
                fileName: 'energy-analytics.pdf',
              })
            }
          >
            Export PDF
          </button>
        </div>
      </section>

      <FilterBar filters={filters} onChange={setFilters} buildings={buildings} showBuilding />

      <section className="chart-grid two-col">
        <ChartPanel title="Energy Consumption Profile" subtitle="Electricity, heating, and cooling demand over the selected period">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={energy.series}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" hide />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="electricityKwh" stroke="#18b7aa" strokeWidth={2} />
              <Line type="monotone" dataKey="heatingKwh" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="coolingKwh" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="totalKwh" stroke="#ef4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Seasonal Demand" subtitle="How seasonal conditions influence city energy demand">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={energy.seasonalDemand}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="season" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalKwh" fill="#0f766e" radius={[8, 8, 0, 0]} />
              <Bar dataKey="peakDemandKw" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </section>

      <section className="chart-grid two-col">
        <ChartPanel title="Renewable Contribution Trend" subtitle="Solar, wind, hydro, and nuclear generation across the selected time range">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={renewable.series}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" hide />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="solarMwh" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="windMwh" stroke="#18b7aa" strokeWidth={2} />
              <Line type="monotone" dataKey="hydroMwh" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="nuclearMwh" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Renewable vs Non-Renewable" subtitle="Contribution percentage for cleaner generation pathways">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={renewable.comparison} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110}>
                {renewable.comparison.map((entry, index) => (
                  <Cell key={entry.name} fill={comparisonColors[index % comparisonColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartPanel>
      </section>

      <section className="chart-grid two-col">
        <ChartPanel title="CO2 Emission Trend" subtitle="Carbon performance over the selected date range">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={co2.series}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" hide />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalTonnes" stroke="#ef4444" strokeWidth={3} />
              <Line type="monotone" dataKey="buildingOperationsTonnes" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="City Energy Demand Structure" subtitle="Demand contribution by building type and urban density">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={cityDemand.demandByBuildingType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalKwh" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="averagePeakDemandKw" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </section>

      <section className="chart-grid two-col">
        <ChartPanel title="Top Buildings by Consumption" subtitle="Search-ready ranking of the highest monitored building demand">
          <DataTable
            columns={[
              { key: 'name', label: 'Building' },
              { key: 'type', label: 'Type' },
              { key: 'district', label: 'District' },
              {
                key: 'totalKwh',
                label: 'Total kWh',
                render: (row) => formatNumber(row.totalKwh),
              },
              {
                key: 'peakDemandKw',
                label: 'Peak Demand kW',
                render: (row) => formatNumber(row.peakDemandKw),
              },
            ]}
            rows={energy.topBuildings}
          />
        </ChartPanel>

        <ChartPanel title="Recent Energy Records" subtitle="Latest building consumption entries available for admin review">
          <DataTable
            columns={[
              {
                key: 'building',
                label: 'Building',
                render: (row) => row.building?.name || 'Unknown',
              },
              {
                key: 'recordedAt',
                label: 'Recorded At',
                render: (row) => new Date(row.recordedAt).toLocaleDateString(),
              },
              {
                key: 'electricityKwh',
                label: 'Electricity',
                render: (row) => formatNumber(row.electricityKwh),
              },
              {
                key: 'peakDemandKw',
                label: 'Peak Demand',
                render: (row) => formatNumber(row.peakDemandKw),
              },
            ]}
            rows={energy.recentRecords}
          />
        </ChartPanel>
      </section>
    </div>
  );
};

export default EnergyAnalyticsPage;
