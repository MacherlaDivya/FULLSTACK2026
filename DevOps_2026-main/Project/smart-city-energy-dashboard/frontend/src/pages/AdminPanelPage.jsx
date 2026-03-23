import { useEffect, useState } from 'react';

import ChartPanel from '../components/ChartPanel';
import DataTable from '../components/DataTable';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';
import api from '../services/api';
import { formatNumber, toDateTimeInputValue } from '../utils/formatters';

const emptyBuildingForm = {
  id: '',
  name: '',
  code: '',
  type: 'residential',
  district: '',
  areaSqm: '',
  occupancy: '',
  populationDensityIndex: 5,
};

const emptyEnergyForm = {
  id: '',
  building: '',
  recordedAt: '',
  electricityKwh: '',
  heatingKwh: '',
  coolingKwh: '',
  peakDemandKw: '',
  occupancyRate: '0.75',
  gridKwh: '',
  naturalGasKwh: '',
  renewableKwh: '',
  nuclearKwh: '',
};

const emptyRenewableForm = {
  id: '',
  recordedAt: '',
  solarMwh: '',
  windMwh: '',
  hydroMwh: '',
  nuclearMwh: '',
  nonRenewableMwh: '',
};

const AdminPanelPage = () => {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [energyRecords, setEnergyRecords] = useState([]);
  const [renewableRecords, setRenewableRecords] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [buildingForm, setBuildingForm] = useState(emptyBuildingForm);
  const [energyForm, setEnergyForm] = useState(emptyEnergyForm);
  const [renewableForm, setRenewableForm] = useState(emptyRenewableForm);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [overviewResponse, usersResponse, buildingsResponse, energyResponse, renewableResponse, contactsResponse] =
        await Promise.all([
          api.get('/admin/overview'),
          api.get('/admin/users'),
          api.get('/buildings'),
          api.get('/energy-consumption'),
          api.get('/renewable-energy'),
          api.get('/contact'),
        ]);

      setOverview(overviewResponse.data.data);
      setUsers(usersResponse.data.data);
      setBuildings(buildingsResponse.data.data);
      setEnergyRecords(energyResponse.data.data.recentRecords);
      setRenewableRecords(renewableResponse.data.data.recentRecords);
      setContacts(contactsResponse.data.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const notify = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleBuildingSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      name: buildingForm.name,
      code: buildingForm.code,
      type: buildingForm.type,
      district: buildingForm.district,
      areaSqm: Number(buildingForm.areaSqm),
      occupancy: Number(buildingForm.occupancy),
      populationDensityIndex: Number(buildingForm.populationDensityIndex),
    };

    if (buildingForm.id) {
      await api.put(`/buildings/${buildingForm.id}`, payload);
      notify('Building updated');
    } else {
      await api.post('/buildings', payload);
      notify('Building created');
    }

    setBuildingForm(emptyBuildingForm);
    loadData();
  };

  const handleEnergySubmit = async (event) => {
    event.preventDefault();
    const payload = {
      building: energyForm.building,
      recordedAt: energyForm.recordedAt,
      electricityKwh: Number(energyForm.electricityKwh),
      heatingKwh: Number(energyForm.heatingKwh),
      coolingKwh: Number(energyForm.coolingKwh),
      peakDemandKw: Number(energyForm.peakDemandKw),
      occupancyRate: Number(energyForm.occupancyRate),
      sourceMix: {
        gridKwh: Number(energyForm.gridKwh),
        naturalGasKwh: Number(energyForm.naturalGasKwh),
        renewableKwh: Number(energyForm.renewableKwh),
        nuclearKwh: Number(energyForm.nuclearKwh),
      },
    };

    if (energyForm.id) {
      await api.put(`/energy-consumption/${energyForm.id}`, payload);
      notify('Energy record updated');
    } else {
      await api.post('/energy-consumption', payload);
      notify('Energy record added');
    }

    setEnergyForm(emptyEnergyForm);
    loadData();
  };

  const handleRenewableSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      recordedAt: renewableForm.recordedAt,
      solarMwh: Number(renewableForm.solarMwh),
      windMwh: Number(renewableForm.windMwh),
      hydroMwh: Number(renewableForm.hydroMwh),
      nuclearMwh: Number(renewableForm.nuclearMwh),
      nonRenewableMwh: Number(renewableForm.nonRenewableMwh),
    };

    if (renewableForm.id) {
      await api.put(`/renewable-energy/${renewableForm.id}`, payload);
      notify('Renewable record updated');
    } else {
      await api.post('/renewable-energy', payload);
      notify('Renewable record added');
    }

    setRenewableForm(emptyRenewableForm);
    loadData();
  };

  const deleteRecord = async (endpoint, id, successText) => {
    await api.delete(`${endpoint}/${id}`);
    notify(successText);
    loadData();
  };

  const updateUserRole = async (id, role) => {
    await api.put(`/admin/users/${id}/role`, { role });
    notify('User role updated');
    loadData();
  };

  const updateContactStatus = async (id, status) => {
    await api.put(`/contact/${id}/status`, { status });
    notify('Contact status updated');
    loadData();
  };

  if (loading) {
    return <Loader label="Loading admin controls..." />;
  }

  if (error) {
    return <div className="page-error">{error}</div>;
  }

  return (
    <div className="page-stack admin-page">
      <section className="page-heading">
        <div>
          <span className="brand-eyebrow">Admin Control Center</span>
          <h2>Manage buildings, records, users, and contact submissions</h2>
          <p>Administrative workflows for data stewardship and dashboard maintenance.</p>
        </div>
        {message ? <div className="form-success floating-message">{message}</div> : null}
      </section>

      <section className="stats-grid compact-stats">
        <StatCard title="Users" value={overview.users} accent="teal" />
        <StatCard title="Buildings" value={overview.buildings} accent="blue" />
        <StatCard title="Energy Records" value={overview.energyRecords} accent="amber" />
        <StatCard title="Renewable Records" value={overview.renewableRecords} accent="violet" />
        <StatCard title="Contact Messages" value={overview.contactMessages} accent="rose" />
      </section>

      <section className="chart-grid three-col admin-forms-grid">
        <ChartPanel title="Building Manager" subtitle="Create or edit monitored buildings">
          <form className="form-grid compact-form" onSubmit={handleBuildingSubmit}>
            <label>
              Name
              <input value={buildingForm.name} onChange={(event) => setBuildingForm({ ...buildingForm, name: event.target.value })} required />
            </label>
            <label>
              Code
              <input value={buildingForm.code} onChange={(event) => setBuildingForm({ ...buildingForm, code: event.target.value })} required />
            </label>
            <label>
              Type
              <select value={buildingForm.type} onChange={(event) => setBuildingForm({ ...buildingForm, type: event.target.value })}>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="public">Public</option>
              </select>
            </label>
            <label>
              District
              <input value={buildingForm.district} onChange={(event) => setBuildingForm({ ...buildingForm, district: event.target.value })} required />
            </label>
            <label>
              Area sqm
              <input type="number" value={buildingForm.areaSqm} onChange={(event) => setBuildingForm({ ...buildingForm, areaSqm: event.target.value })} required />
            </label>
            <label>
              Occupancy
              <input type="number" value={buildingForm.occupancy} onChange={(event) => setBuildingForm({ ...buildingForm, occupancy: event.target.value })} required />
            </label>
            <label>
              Density Index
              <input
                type="number"
                min="1"
                max="10"
                value={buildingForm.populationDensityIndex}
                onChange={(event) => setBuildingForm({ ...buildingForm, populationDensityIndex: event.target.value })}
                required
              />
            </label>
            <div className="full-span inline-actions">
              <button type="submit" className="primary-button slim">{buildingForm.id ? 'Update' : 'Create'}</button>
              <button type="button" className="ghost-button" onClick={() => setBuildingForm(emptyBuildingForm)}>Clear</button>
            </div>
          </form>
        </ChartPanel>

        <ChartPanel title="Energy Data Manager" subtitle="Add or edit building energy records">
          <form className="form-grid compact-form" onSubmit={handleEnergySubmit}>
            <label>
              Building
              <select value={energyForm.building} onChange={(event) => setEnergyForm({ ...energyForm, building: event.target.value })} required>
                <option value="">Select</option>
                {buildings.map((building) => (
                  <option key={building._id} value={building._id}>{building.name}</option>
                ))}
              </select>
            </label>
            <label>
              Recorded At
              <input type="datetime-local" value={energyForm.recordedAt} onChange={(event) => setEnergyForm({ ...energyForm, recordedAt: event.target.value })} required />
            </label>
            <label>
              Electricity
              <input type="number" value={energyForm.electricityKwh} onChange={(event) => setEnergyForm({ ...energyForm, electricityKwh: event.target.value })} required />
            </label>
            <label>
              Heating
              <input type="number" value={energyForm.heatingKwh} onChange={(event) => setEnergyForm({ ...energyForm, heatingKwh: event.target.value })} required />
            </label>
            <label>
              Cooling
              <input type="number" value={energyForm.coolingKwh} onChange={(event) => setEnergyForm({ ...energyForm, coolingKwh: event.target.value })} required />
            </label>
            <label>
              Peak Demand
              <input type="number" value={energyForm.peakDemandKw} onChange={(event) => setEnergyForm({ ...energyForm, peakDemandKw: event.target.value })} required />
            </label>
            <label>
              Occupancy Rate
              <input type="number" step="0.01" min="0" max="1" value={energyForm.occupancyRate} onChange={(event) => setEnergyForm({ ...energyForm, occupancyRate: event.target.value })} required />
            </label>
            <label>
              Grid kWh
              <input type="number" value={energyForm.gridKwh} onChange={(event) => setEnergyForm({ ...energyForm, gridKwh: event.target.value })} required />
            </label>
            <label>
              Natural Gas kWh
              <input type="number" value={energyForm.naturalGasKwh} onChange={(event) => setEnergyForm({ ...energyForm, naturalGasKwh: event.target.value })} required />
            </label>
            <label>
              Renewable kWh
              <input type="number" value={energyForm.renewableKwh} onChange={(event) => setEnergyForm({ ...energyForm, renewableKwh: event.target.value })} required />
            </label>
            <label>
              Nuclear kWh
              <input type="number" value={energyForm.nuclearKwh} onChange={(event) => setEnergyForm({ ...energyForm, nuclearKwh: event.target.value })} required />
            </label>
            <div className="full-span inline-actions">
              <button type="submit" className="primary-button slim">{energyForm.id ? 'Update' : 'Add'}</button>
              <button type="button" className="ghost-button" onClick={() => setEnergyForm(emptyEnergyForm)}>Clear</button>
            </div>
          </form>
        </ChartPanel>

        <ChartPanel title="Renewable Data Manager" subtitle="Add or update renewable generation records">
          <form className="form-grid compact-form" onSubmit={handleRenewableSubmit}>
            <label>
              Recorded At
              <input type="datetime-local" value={renewableForm.recordedAt} onChange={(event) => setRenewableForm({ ...renewableForm, recordedAt: event.target.value })} required />
            </label>
            <label>
              Solar MWh
              <input type="number" value={renewableForm.solarMwh} onChange={(event) => setRenewableForm({ ...renewableForm, solarMwh: event.target.value })} required />
            </label>
            <label>
              Wind MWh
              <input type="number" value={renewableForm.windMwh} onChange={(event) => setRenewableForm({ ...renewableForm, windMwh: event.target.value })} required />
            </label>
            <label>
              Hydro MWh
              <input type="number" value={renewableForm.hydroMwh} onChange={(event) => setRenewableForm({ ...renewableForm, hydroMwh: event.target.value })} required />
            </label>
            <label>
              Nuclear MWh
              <input type="number" value={renewableForm.nuclearMwh} onChange={(event) => setRenewableForm({ ...renewableForm, nuclearMwh: event.target.value })} required />
            </label>
            <label>
              Non-Renewable MWh
              <input type="number" value={renewableForm.nonRenewableMwh} onChange={(event) => setRenewableForm({ ...renewableForm, nonRenewableMwh: event.target.value })} required />
            </label>
            <div className="full-span inline-actions">
              <button type="submit" className="primary-button slim">{renewableForm.id ? 'Update' : 'Add'}</button>
              <button type="button" className="ghost-button" onClick={() => setRenewableForm(emptyRenewableForm)}>Clear</button>
            </div>
          </form>
        </ChartPanel>
      </section>

      <section className="chart-grid one-col">
        <ChartPanel title="Buildings" subtitle="Edit or delete monitored building records">
          <DataTable
            rows={buildings.slice(0, 10)}
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'code', label: 'Code' },
              { key: 'type', label: 'Type' },
              { key: 'district', label: 'District' },
              { key: 'areaSqm', label: 'Area', render: (row) => formatNumber(row.areaSqm) },
            ]}
            actions={[
              {
                label: 'Edit',
                onClick: (row) =>
                  setBuildingForm({
                    id: row._id,
                    name: row.name,
                    code: row.code,
                    type: row.type,
                    district: row.district,
                    areaSqm: row.areaSqm,
                    occupancy: row.occupancy,
                    populationDensityIndex: row.populationDensityIndex,
                  }),
              },
              {
                label: 'Delete',
                variant: 'danger',
                onClick: (row) => deleteRecord('/buildings', row._id, 'Building deleted'),
              },
            ]}
          />
        </ChartPanel>
      </section>

      <section className="chart-grid two-col">
        <ChartPanel title="Energy Records" subtitle="Recent building consumption records">
          <DataTable
            rows={energyRecords}
            columns={[
              { key: 'building', label: 'Building', render: (row) => row.building?.name || 'Unknown' },
              { key: 'recordedAt', label: 'Date', render: (row) => new Date(row.recordedAt).toLocaleString() },
              { key: 'electricityKwh', label: 'Electricity', render: (row) => formatNumber(row.electricityKwh) },
              { key: 'peakDemandKw', label: 'Peak Demand', render: (row) => formatNumber(row.peakDemandKw) },
            ]}
            actions={[
              {
                label: 'Edit',
                onClick: (row) =>
                  setEnergyForm({
                    id: row._id,
                    building: row.building?._id || '',
                    recordedAt: toDateTimeInputValue(row.recordedAt),
                    electricityKwh: row.electricityKwh,
                    heatingKwh: row.heatingKwh,
                    coolingKwh: row.coolingKwh,
                    peakDemandKw: row.peakDemandKw,
                    occupancyRate: row.occupancyRate,
                    gridKwh: row.sourceMix?.gridKwh,
                    naturalGasKwh: row.sourceMix?.naturalGasKwh,
                    renewableKwh: row.sourceMix?.renewableKwh,
                    nuclearKwh: row.sourceMix?.nuclearKwh,
                  }),
              },
              {
                label: 'Delete',
                variant: 'danger',
                onClick: (row) => deleteRecord('/energy-consumption', row._id, 'Energy record deleted'),
              },
            ]}
          />
        </ChartPanel>

        <ChartPanel title="Renewable Records" subtitle="Recent renewable generation entries">
          <DataTable
            rows={renewableRecords}
            columns={[
              { key: 'recordedAt', label: 'Date', render: (row) => new Date(row.recordedAt).toLocaleString() },
              { key: 'solarMwh', label: 'Solar', render: (row) => formatNumber(row.solarMwh) },
              { key: 'windMwh', label: 'Wind', render: (row) => formatNumber(row.windMwh) },
              { key: 'hydroMwh', label: 'Hydro', render: (row) => formatNumber(row.hydroMwh) },
            ]}
            actions={[
              {
                label: 'Edit',
                onClick: (row) =>
                  setRenewableForm({
                    id: row._id,
                    recordedAt: toDateTimeInputValue(row.recordedAt),
                    solarMwh: row.solarMwh,
                    windMwh: row.windMwh,
                    hydroMwh: row.hydroMwh,
                    nuclearMwh: row.nuclearMwh,
                    nonRenewableMwh: row.nonRenewableMwh,
                  }),
              },
              {
                label: 'Delete',
                variant: 'danger',
                onClick: (row) => deleteRecord('/renewable-energy', row._id, 'Renewable record deleted'),
              },
            ]}
          />
        </ChartPanel>
      </section>

      <section className="chart-grid two-col">
        <ChartPanel title="Users" subtitle="Manage user roles and remove accounts">
          <DataTable
            rows={users}
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              {
                key: 'role',
                label: 'Role',
                render: (row) => (
                  <select value={row.role} onChange={(event) => updateUserRole(row._id, event.target.value)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                ),
              },
            ]}
            actions={[
              {
                label: 'Delete',
                variant: 'danger',
                onClick: (row) => deleteRecord('/admin/users', row._id, 'User deleted'),
              },
            ]}
          />
        </ChartPanel>

        <ChartPanel title="Contact Submissions" subtitle="Review incoming questions and update their status">
          <DataTable
            rows={contacts}
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { key: 'subject', label: 'Subject' },
              { key: 'message', label: 'Message' },
              {
                key: 'status',
                label: 'Status',
                render: (row) => (
                  <select value={row.status} onChange={(event) => updateContactStatus(row._id, event.target.value)}>
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                ),
              },
            ]}
          />
        </ChartPanel>
      </section>
    </div>
  );
};

export default AdminPanelPage;
