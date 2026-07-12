'use client';

import { useState, useEffect } from 'react';
import { Building2, Tags, Users } from 'lucide-react';

export default function OrganizationPage() {
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/organization/departments').then(res => res.json()).then(setDepartments);
    fetch('/api/organization/categories').then(res => res.json()).then(setCategories);
    fetch('/api/organization/users').then(res => res.json()).then(setUsers);
  }, []);

  return (
    <div className="space-y-6">
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
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
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
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
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
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
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
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900">Promote Role</button>
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
    </div>
  );
}
