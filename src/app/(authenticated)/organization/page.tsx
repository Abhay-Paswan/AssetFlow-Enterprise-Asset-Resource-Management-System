'use client';

import { useState, useEffect } from 'react';
import { Building2, Tags, Users, X } from 'lucide-react';

export default function OrganizationPage() {
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  // Modals state
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  
  // Forms state
  const [deptName, setDeptName] = useState('');
  const [catName, setCatName] = useState('');
  const [catAttrs, setCatAttrs] = useState('');
  const [promoteRole, setPromoteRole] = useState('Employee');

  const fetchData = () => {
    fetch('/api/organization/departments').then(res => res.json()).then(setDepartments);
    fetch('/api/organization/categories').then(res => res.json()).then(setCategories);
    fetch('/api/organization/users').then(res => res.json()).then(setUsers);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/organization/departments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: deptName })
    });
    if (res.ok) {
      setDeptName('');
      setShowDeptModal(false);
      fetchData();
    }
  };

  const handleCreateCat = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/organization/categories/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: catName, customAttributes: catAttrs })
    });
    if (res.ok) {
      setCatName('');
      setCatAttrs('');
      setShowCatModal(false);
      fetchData();
    }
  };

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/organization/users/promote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedUserId, role: promoteRole })
    });
    if (res.ok) {
      setShowPromoteModal(false);
      fetchData();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Organization Setup</h1>
        <p className="text-slate-500">Manage departments, asset categories, and employee directory.</p>
      </div>

      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('departments')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'departments' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            <Building2 className="mr-2 h-5 w-5" />
            Departments
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'categories' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            <Tags className="mr-2 h-5 w-5" />
            Asset Categories
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'users' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            <Users className="mr-2 h-5 w-5" />
            Employee Directory
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'departments' && (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-slate-900">Departments</h3>
              <button 
                onClick={() => setShowDeptModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                Add Department
              </button>
            </div>
            <div className="border-t border-slate-200">
              <ul className="divide-y divide-slate-200">
                {departments.map((dept: any) => (
                  <li key={dept.id} className="px-4 py-4 sm:px-6 flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-600 truncate">{dept.name}</p>
                      <p className="text-sm text-slate-500">Head: {dept.head?.name || 'Unassigned'}</p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                        {dept.status}
                      </p>
                    </div>
                  </li>
                ))}
                {departments.length === 0 && (
                  <li className="px-4 py-4 sm:px-6 text-sm text-slate-500 text-center">No departments found.</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-slate-900">Asset Categories</h3>
              <button 
                onClick={() => setShowCatModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                Add Category
              </button>
            </div>
            <div className="border-t border-slate-200">
              <ul className="divide-y divide-slate-200">
                {categories.map((cat: any) => (
                  <li key={cat.id} className="px-4 py-4 sm:px-6 flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-600 truncate">{cat.name}</p>
                      <p className="text-sm text-slate-500">Attributes: {cat.customAttributes}</p>
                    </div>
                  </li>
                ))}
                {categories.length === 0 && (
                  <li className="px-4 py-4 sm:px-6 text-sm text-slate-500 text-center">No categories found.</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-slate-900">Employee Directory</h3>
            </div>
            <div className="border-t border-slate-200 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {users.map((user: any) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {user.department?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => { setSelectedUserId(user.id); setPromoteRole(user.role); setShowPromoteModal(true); }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Promote Role
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-500">No employees found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showDeptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Department</h2>
              <button onClick={() => setShowDeptModal(false)}><X className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateDept} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Department Name</label>
                <input required type="text" className="mt-1 w-full border border-slate-300 rounded-lg p-2" value={deptName} onChange={e => setDeptName(e.target.value)} />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white rounded-lg p-2 mt-4 hover:bg-indigo-700">Create</button>
            </form>
          </div>
        </div>
      )}

      {showCatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Asset Category</h2>
              <button onClick={() => setShowCatModal(false)}><X className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateCat} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Category Name</label>
                <input required type="text" className="mt-1 w-full border border-slate-300 rounded-lg p-2" value={catName} onChange={e => setCatName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Custom Attributes (JSON Array)</label>
                <input type="text" placeholder='["Color", "Size"]' className="mt-1 w-full border border-slate-300 rounded-lg p-2" value={catAttrs} onChange={e => setCatAttrs(e.target.value)} />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white rounded-lg p-2 mt-4 hover:bg-indigo-700">Create</button>
            </form>
          </div>
        </div>
      )}

      {showPromoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Promote Employee Role</h2>
              <button onClick={() => setShowPromoteModal(false)}><X className="text-slate-400" /></button>
            </div>
            <form onSubmit={handlePromote} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Select Role</label>
                <select className="mt-1 w-full border border-slate-300 rounded-lg p-2" value={promoteRole} onChange={e => setPromoteRole(e.target.value)}>
                  <option value="Employee">Employee</option>
                  <option value="Department Head">Department Head</option>
                  <option value="Asset Manager">Asset Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white rounded-lg p-2 mt-4 hover:bg-indigo-700">Update Role</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
