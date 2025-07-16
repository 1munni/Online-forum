
import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure"; // Adjust path as needed
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
 
// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const AdminProfilePage = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth(); 
  const [adminProfile, setAdminProfile] = useState(null);
  const [siteStats, setSiteStats] = useState(null);
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.email) {
        setError("User not logged in or email not available.");
        setLoading(false);
        return;
      }

      try {
        // Fetch Admin Profile Data
        const profileRes = await axiosSecure.get(`/admin-profile/${user.email}`);
        setAdminProfile(profileRes.data);

        // Fetch Site Statistics
        const statsRes = await axiosSecure.get("/site-stats");
        setSiteStats(statsRes.data);

        // Fetch Tags
        const tagsRes = await axiosSecure.get("/tags");
        setTags(tagsRes.data);

      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to load admin data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosSecure, user]);

  const handleAddTag = async (e) => {
  e.preventDefault();
  if (!newTagName.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Empty Tag Name",
      text: "Tag name cannot be empty.",
    });
    return;
  }
  try {
    const res = await axiosSecure.post("/tags", { name: newTagName });
    setTags([...tags, res.data]);
    setNewTagName("");
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Tag added successfully!",
    });
  } catch (err) {
    console.error("Error adding tag:", err);
    if (err.response?.status === 409) {
      Swal.fire({
        icon: "info",
        title: "Already Exists",
        text: "This tag already exists!",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add tag. Please try again.",
      });
    }
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-700">
        Loading admin dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-lg">
        Error: {error}
      </div>
    );
  }

  const chartData = siteStats
    ? {
        labels: ["Total Posts", "Total Comments", "Total Users"],
        datasets: [
          {
            data: [
              siteStats.totalPosts,
              siteStats.totalComments,
              siteStats.totalUsers,
            ],
            backgroundColor: ["#8B5CF6", "#EC4899", "#10B981"], // Purple, Pink, Green
            hoverOffset: 4,
          },
        ],
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden p-6 sm:p-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 border-b-2 border-indigo-600 pb-4">
          Admin Dashboard
        </h1>

        {/* Admin Profile Section */}
        <section className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg p-6 sm:p-8 shadow-xl mb-12 flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="flex-shrink-0">
            <img
              src={adminProfile?.image || "[https://via.placeholder.com/150](https://via.placeholder.com/150)"}
              alt="Admin Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              {adminProfile?.name || "Admin Name"}
            </h2>
            <p className="text-lg sm:text-xl font-medium mb-1">
              Email: {adminProfile?.email || "admin@example.com"}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-lg">
              <p>
                Posts:{" "}
                <span className="font-semibold">
                  {adminProfile?.posts || 0}
                </span>
              </p>
              <p>
                Comments:{" "}
                <span className="font-semibold">
                  {adminProfile?.comments || 0}
                </span>
              </p>
              <p>
                Users:{" "}
                <span className="font-semibold">
                  {siteStats?.totalUsers || 0}
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Site Statistics - Pie Chart */}
        <section className="mb-12 bg-gray-50 rounded-lg p-6 sm:p-8 shadow-md">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8 border-b border-gray-300 pb-4">
            Site Statistics Overview
          </h3>
          <div className="flex justify-center items-center min-h-[300px]">
            {chartData && (
              <div className="w-full max-w-md">
                <Pie
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: "right",
                        labels: {
                          font: {
                            size: 14,
                          },
                        },
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            let label = context.label || "";
                            if (label) {
                              label += ": ";
                            }
                            if (context.parsed !== null) {
                              label += context.parsed;
                            }
                            return label;
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </section>

        {/* Tag Management Form */}
        <section className="bg-gray-50 rounded-lg p-6 sm:p-8 shadow-md">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8 border-b border-gray-300 pb-4">
            Manage Tags
          </h3>
          <form onSubmit={handleAddTag} className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Enter new tag name"
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Add Tag
              </button>
            </div>
          </form>

          <div className="mt-8">
            <h4 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
              Existing Tags
            </h4>
            {tags.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-3">
                {tags.map((tag) => (
                  <span
                    key={tag._id}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-md font-medium shadow-sm"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No tags added yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminProfilePage;