import { useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';

const MakeAnnouncement = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth(); // Your auth hook should provide user info
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description) {
            return Swal.fire('Error', 'Please fill in all required fields.', 'error');
        }

        const announcement = {
            authorName: user?.displayName || 'Admin',
            authorImage: user?.photoURL || '',
            title,
            description,
            createdAt: new Date().toISOString()
        };

        try {
            setLoading(true);
            await axiosSecure.post('/admin/announcements', announcement);
            Swal.fire('Success', 'Announcement posted successfully!', 'success');
            setTitle('');
            setDescription('');
        } catch (err) {
            console.error(err);
            Swal.fire('Error', err.response?.data?.error || 'Failed to post announcement.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded-lg mt-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">Make an Announcement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium text-gray-700">Author</label>
                    <div className="flex items-center space-x-4 mt-2">
                        <img
                            src={user?.photoURL || '/default-avatar.png'}
                            alt="Author"
                            className="w-12 h-12 rounded-full border"
                        />
                        <span className="text-gray-800 font-semibold">{user?.displayName || 'Admin'}</span>
                    </div>
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                        placeholder="Enter announcement title"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="5"
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                        placeholder="Write the details of your announcement"
                        required
                    ></textarea>
                </div>

                <div className="text-center">
                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-md transition-colors duration-200"
                        disabled={loading}
                    >
                        {loading ? 'Posting...' : 'Post Announcement'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MakeAnnouncement;
