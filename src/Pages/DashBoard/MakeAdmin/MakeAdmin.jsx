import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FaTimes, FaUserShield } from 'react-icons/fa';

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchEmail, setSearchEmail] = useState('');
  const [debouncedEmail, setDebouncedEmail] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchEmail(value);
    if (value.trim().length >= 1) {
      setTimeout(() => {
        setDebouncedEmail(value);
      }, 300);
    }
  };

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['searchUsers', debouncedEmail],
    enabled: !!debouncedEmail,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users-search/search?email=${debouncedEmail}`);
      return res.data;
    },
  });

  const { mutate: makeAdmin } = useMutation({
    mutationFn: async (userId) => {
      const res = await axiosSecure.patch(`/users/${userId}/role`, { role: 'admin' });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire('Success', 'User promoted to admin', 'success');
      queryClient.invalidateQueries(['searchUsers', debouncedEmail]);
    },
  });

  const { mutate: removeAdmin } = useMutation({
    mutationFn: async (userId) => {
      const res = await axiosSecure.patch(`/users/${userId}/role`, { role: 'user' });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire('Success', 'Admin rights removed', 'success');
      queryClient.invalidateQueries(['searchUsers', debouncedEmail]);
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Search Users to Make Admin</h2>

      <input
        type="text"
        placeholder="Search by email..."
        className="w-full border border-gray-300 p-2 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchEmail}
        onChange={handleSearch}
      />

      {isLoading && <p>Searching users...</p>}

      {!isLoading && users.length > 0 && (
        <>
          {/* Table for md+ screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left whitespace-nowrap">Email</th>
                  <th className="p-2 text-left whitespace-nowrap">Role</th>
                  <th className="p-2 text-left whitespace-nowrap">Membership</th>
                  <th className="p-2 text-left whitespace-nowrap">Created Date</th>
                  <th className="p-2 text-left whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isMember = user?.membership?.toLowerCase() === 'member';
                  const createdDate = user?.createdAt
                    ? new Date(user.createdAt).toLocaleString()
                    : 'N/A';
             

                  return (
                    <tr key={user._id} className="border-t border-gray-200">
                      <td className="p-2 break-all">{user.email}</td>
                      <td className="p-2 capitalize">{user.role}</td>
                      <td className="p-2">
                        <span
                          className={isMember ? 'text-yellow-600 font-semibold' : 'text-gray-500'}
                        >
                          {isMember ? 'Member' : 'Registered'}
                        </span>
                      </td>
                      <td className="p-2 whitespace-nowrap">{createdDate}</td>
                      <td className="p-2 whitespace-nowrap">
                        {user.role === 'admin' ? (
                          <button
                            onClick={() => removeAdmin(user._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          >
                            <FaTimes className="inline mr-1" /> Remove Admin
                          </button>
                        ) : (
                          <button
                            onClick={() => makeAdmin(user._id)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                          >
                            <FaUserShield className="inline mr-1" /> Make Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Card list for small screens */}
          <div className="md:hidden space-y-4">
            {users.map((user) => {
              const isMember = user?.membership?.toLowerCase() === 'member';
              const createdDate = user?.createdAt
                ? new Date(user.createdAt).toLocaleString()
                : 'N/A';
              const lastLogin = user?.lastLogin
                ? new Date(user.lastLogin).toLocaleString()
                : 'N/A';

              return (
                <div
                  key={user._id}
                  className="border rounded p-4 shadow-sm bg-gray-50"
                >
                  <p><strong>Email:</strong> <span className="break-all">{user.email}</span></p>
                  <p><strong>Role:</strong> <span className="capitalize">{user.role}</span></p>
                  <p>
                    <strong>Membership:</strong>{' '}
                    <span className={isMember ? 'text-yellow-600 font-semibold' : 'text-gray-500'}>
                      {isMember ? 'Member' : 'Registered'}
                    </span>
                  </p>
                  <p><strong>Created Date:</strong> {createdDate}</p>
                  <p><strong>Last Login:</strong> {lastLogin}</p>
                  <div className="mt-3 flex gap-3 flex-wrap">
                    {user.role === 'admin' ? (
                      <button
                        onClick={() => removeAdmin(user._id)}
                        className="flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        <FaTimes className="inline mr-1" /> Remove Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => makeAdmin(user._id)}
                        className="flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                      >
                        <FaUserShield className="inline mr-1" /> Make Admin
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {!isLoading && debouncedEmail && users.length === 0 && (
        <p className="text-gray-500 mt-4">No users found for "{debouncedEmail}"</p>
      )}
    </div>
  );
};

export default MakeAdmin;
