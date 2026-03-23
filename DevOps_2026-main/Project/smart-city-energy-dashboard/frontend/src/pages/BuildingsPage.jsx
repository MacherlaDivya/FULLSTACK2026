import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import ChartPanel from '../components/ChartPanel';
import DataTable from '../components/DataTable';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';
import api from '../services/api';
import { formatNumber } from '../utils/formatters';

const BuildingsPage = () => {
  const [filters, setFilters] = useState({ search: '', type: '', minConsumption: '' });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await api.get('/buildings', { params: filters });
        setRows(response.data.data);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const summary = useMemo(() => {
    const totalConsumption = rows.reduce((accumulator, row) => accumulator + row.totalConsumptionKwh, 0);
    const averageArea = rows.length
      ? rows.reduce((accumulator, row) => accumulator + row.areaSqm, 0) / rows.length
      : 0;

    return {
      totalBuildings: rows.length,
      totalConsumption,
      averageArea,
    };
  }, [rows]);

  if (loading) {
    return <Loader label="Loading building portfolio..." />;
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <span className="brand-eyebrow">Building Portfolio</span>
          <h2>Search monitored buildings by energy demand</h2>
          <p>Filter the city inventory by building type, search terms, and minimum consumption.</p>
        </div>
      </section>

      <section className="stats-grid compact-stats">
        <StatCard title="Visible Buildings" value={summary.totalBuildings} accent="teal" />
        <StatCard title="Portfolio Consumption" value={summary.totalConsumption} suffix=" kWh" accent="amber" />
        <StatCard title="Average Area" value={summary.averageArea} suffix=" sqm" accent="blue" />
      </section>

      <section className="panel filter-bar building-filter-grid">
        <div className="filter-field">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            value={filters.search}
            onChange={(event) => setFilters({ ...filters, search: event.target.value })}
            placeholder="Building, code, district"
          />
        </div>
        <div className="filter-field">
          <label htmlFor="type">Type</label>
          <select id="type" value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })}>
            <option value="">All</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
            <option value="public">Public</option>
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="minConsumption">Min Consumption</label>
          <input
            id="minConsumption"
            type="number"
            value={filters.minConsumption}
            onChange={(event) => setFilters({ ...filters, minConsumption: event.target.value })}
            placeholder="kWh"
          />
        </div>
      </section>

      <section className="chart-grid two-col">
        <ChartPanel title="Top Visible Building Consumption" subtitle="Comparison across the filtered building set">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={rows.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="code" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalConsumptionKwh" fill="#0f766e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Building Inventory" subtitle="Search results aligned with monitored energy consumption totals">
          <DataTable
            rows={rows}
            columns={[
              { key: 'name', label: 'Building' },
              { key: 'code', label: 'Code' },
              { key: 'type', label: 'Type' },
              { key: 'district', label: 'District' },
              { key: 'areaSqm', label: 'Area sqm', render: (row) => formatNumber(row.areaSqm) },
              { key: 'occupancy', label: 'Occupancy', render: (row) => formatNumber(row.occupancy, { maximumFractionDigits: 0 }) },
              {
                key: 'totalConsumptionKwh',
                label: 'Consumption kWh',
                render: (row) => formatNumber(row.totalConsumptionKwh),
              },
            ]}
          />
        </ChartPanel>
      </section>
    </div>
  );
};

export default BuildingsPage;
