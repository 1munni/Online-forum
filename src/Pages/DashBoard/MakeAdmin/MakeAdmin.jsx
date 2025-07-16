import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FaTimes, FaUserShield, FaSearch, FaSpinner } from 'react-icons/fa'; // Added FaSearch and FaSpinner

const MakeAdmin = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [searchEmail, setSearchEmail] = useState('');
    const [debouncedEmail, setDebouncedEmail] = useState('');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchEmail(value);
        // Only debounce if there's actual input
        if (value.trim().length >= 1) {
            setTimeout(() => {
                setDebouncedEmail(value);
            }, 300);
        } else {
            // Clear debounced email if input is empty to clear search results
            setDebouncedEmail('');
        }
    };

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['searchUsers', debouncedEmail],
        enabled: !!debouncedEmail, // Only run query if debouncedEmail is not empty
        queryFn: async () => {
            const res = await axiosSecure.get(`/users-search/search?email=${debouncedEmail}`);
            return res.data;
        },
    });

    const { mutate: makeAdmin, isLoading: isMakingAdmin } = useMutation({ // Added isLoading alias
        mutationFn: async (userId) => {
            const res = await axiosSecure.patch(`/users/${userId}/role`, { role: 'admin' });
            return res.data;
        },
        onSuccess: () => {
            Swal.fire({
                title: 'Success!',
                text: 'User promoted to admin.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });
            queryClient.invalidateQueries(['searchUsers', debouncedEmail]);
        },
        onError: (err) => {
            console.error('Error making admin:', err);
            Swal.fire('Error', err.response?.data?.error || 'Failed to promote user.', 'error');
        },
    });

    const { mutate: removeAdmin, isLoading: isRemovingAdmin } = useMutation({ // Added isLoading alias
        mutationFn: async (userId) => {
            const res = await axiosSecure.patch(`/users/${userId}/role`, { role: 'user' });
            return res.data;
        },
        onSuccess: () => {
            Swal.fire({
                title: 'Success!',
                text: 'Admin rights removed.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });
            queryClient.invalidateQueries(['searchUsers', debouncedEmail]);
        },
        onError: (err) => {
            console.error('Error removing admin:', err);
            Swal.fire('Error', err.response?.data?.error || 'Failed to remove admin rights.', 'error');
        },
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-10"> {/* Adjusted padding-y */}
            {/* Page Title Section - Consistent with other admin pages */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl mb-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold break-words"> {/* Changed from font-extrabold to font-bold */}
                    Manage User Roles
                </h2>
                <p className="text-lg font-medium opacity-90 mt-2">
                    Search users by email and assign or revoke admin privileges.
                </p>
            </div>

            {/* Search Input */}
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 flex items-center">
                <FaSearch className="text-gray-500 mr-3 text-xl" />
                <input
                    type="text"
                    placeholder="Search by email..."
                    className="flex-grow border-b border-gray-300 p-2 text-lg focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                    value={searchEmail}
                    onChange={handleSearch}
                />
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center min-h-[100px] text-gray-600">
                    <FaSpinner className="animate-spin text-2xl mr-2 text-indigo-600" />
                    <p className="text-lg">Searching users...</p>
                </div>
            )}

            {/* No Search Performed / No Results */}
            {!isLoading && !debouncedEmail && (
                <div className="bg-white shadow-md rounded-lg p-6 text-center text-gray-500">
                    <p className="text-lg">Enter an email in the search bar to find users.</p>
                </div>
            )}

            {!isLoading && debouncedEmail && users.length === 0 && (
                <div className="bg-white shadow-md rounded-lg p-6 text-center text-gray-500">
                    <p className="text-lg">No users found for "<span className="font-semibold text-indigo-600">{debouncedEmail}</span>"</p>
                </div>
            )}

            {/* User Results Table for md+ screens */}
            {!isLoading && users.length > 0 && (
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto"> {/* Ensures horizontal scrolling */}
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Email</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Role</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Membership</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">Created Date</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {users.map((user) => {
                                    const isMember = user?.membership?.toLowerCase() === 'member';
                                    const createdDate = user?.createdAt
                                        ? new Date(user.createdAt).toLocaleString()
                                        : 'N/A';

                                    return (
                                        <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150 align-middle">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 break-all">{user.email}</td>
                                            <td className="px-6 py-4 text-sm capitalize text-gray-700">{user.role}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={isMember ? 'text-yellow-600 font-semibold' : 'text-gray-500'}>
                                                    {isMember ? 'Member' : 'Registered'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap hidden sm:table-cell">{createdDate}</td>
                                            <td className="px-6 py-4 text-center">
                                                {user.role === 'admin' ? (
                                                    <button
                                                        onClick={() => removeAdmin(user._id)}
                                                        className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-200
                                                            ${isRemovingAdmin && isRemovingAdmin === user._id // Check specific mutation loading state
                                                                ? 'bg-gray-400 cursor-not-allowed'
                                                                : 'bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                                                            }`}
                                                        disabled={isMakingAdmin || isRemovingAdmin} // Disable both buttons during any action
                                                    >
                                                        {isRemovingAdmin && isRemovingAdmin === user._id ? ( // Show spinner only for the current action
                                                            <FaSpinner className="animate-spin mr-2" />
                                                        ) : (
                                                            <FaTimes className="mr-1" />
                                                        )}
                                                        Remove Admin
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => makeAdmin(user._id)}
                                                        className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-200
                                                            ${isMakingAdmin && isMakingAdmin === user._id // Check specific mutation loading state
                                                                ? 'bg-gray-400 cursor-not-allowed'
                                                                : 'bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                                            }`}
                                                        disabled={isMakingAdmin || isRemovingAdmin} // Disable both buttons during any action
                                                    >
                                                        {isMakingAdmin && isMakingAdmin === user._id ? ( // Show spinner only for the current action
                                                            <FaSpinner className="animate-spin mr-2" />
                                                        ) : (
                                                            <FaUserShield className="mr-1" />
                                                        )}
                                                        Make Admin
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* User Results Card List for small screens */}
            {!isLoading && users.length > 0 && (
                <div className="sm:hidden space-y-4"> {/* Changed md:hidden to sm:hidden for consistency */}
                    {users.map((user) => {
                        const isMember = user?.membership?.toLowerCase() === 'member';
                        const createdDate = user?.createdAt
                            ? new Date(user.createdAt).toLocaleString()
                            : 'N/A';
                        // Removed lastLogin as it was not present in table version
                        // const lastLogin = user?.lastLogin
                        //     ? new Date(user.lastLogin).toLocaleString()
                        //     : 'N/A';

                        return (
                            <div
                                key={user._id}
                                className="bg-white rounded-xl p-5 shadow-lg border border-gray-100" // Enhanced card styling
                            >
                                <p className="mb-2">
                                    <strong className="text-gray-700">Email:</strong> <span className="break-all text-gray-900 font-medium">{user.email}</span>
                                </p>
                                <p className="mb-2">
                                    <strong className="text-gray-700">Role:</strong> <span className="capitalize text-gray-800">{user.role}</span>
                                </p>
                                <p className="mb-2">
                                    <strong className="text-gray-700">Membership:</strong>{' '}
                                    <span className={isMember ? 'text-yellow-600 font-semibold' : 'text-gray-500'}>
                                        {isMember ? 'Member' : 'Registered'}
                                    </span>
                                </p>
                                <p className="mb-4 text-gray-600">
                                    <strong className="text-gray-700">Created Date:</strong> {createdDate}
                                </p>
                                {/* Removed Last Login from card view too, for consistency */}
                                {/* <p className="mb-4"><strong>Last Login:</strong> {lastLogin}</p> */}

                                <div className="mt-4 flex flex-wrap gap-3 justify-center"> {/* Centered buttons */}
                                    {user.role === 'admin' ? (
                                        <button
                                            onClick={() => removeAdmin(user._id)}
                                            className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-200 w-full sm:w-auto
                                                ${isRemovingAdmin && isRemovingAdmin === user._id
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                                                }`}
                                            disabled={isMakingAdmin || isRemovingAdmin}
                                        >
                                            {isRemovingAdmin && isRemovingAdmin === user._id ? (
                                                <FaSpinner className="animate-spin mr-2" />
                                            ) : (
                                                <FaTimes className="mr-1" />
                                            )}
                                            Remove Admin
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => makeAdmin(user._id)}
                                            className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-200 w-full sm:w-auto
                                                ${isMakingAdmin && isMakingAdmin === user._id
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                                }`}
                                            disabled={isMakingAdmin || isRemovingAdmin}
                                        >
                                            {isMakingAdmin && isMakingAdmin === user._id ? (
                                                <FaSpinner className="animate-spin mr-2" />
                                            ) : (
                                                <FaUserShield className="mr-1" />
                                            )}
                                            Make Admin
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MakeAdmin;