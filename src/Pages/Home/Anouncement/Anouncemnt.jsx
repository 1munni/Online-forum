import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const Announcement = () => {
  const axiosSecure = useAxiosSecure();

  const { data: announcements = [] } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/announcements");
      return res.data;
    },
  });

  if (!announcements.length) return null;

  return (
    <div className="my-20 px-4 md:px-8 lg:px-12 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        📢 <span>Latest Announcements</span>
      </h2>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {announcements.map((a) => (
          <div
            key={a._id}
            className="rounded-2xl shadow-md p-6 bg-white hover:shadow-xl transition duration-100 border border-gray-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={a.authorImage}
                alt={a.authorName}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
              />
              <div>
                <h4 className="font-semibold text-gray-800">{a.authorName}</h4>
                <p className="text-xs text-gray-500">
                  {new Date(a.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-indigo-600 mb-1">
              {a.title}
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcement;
