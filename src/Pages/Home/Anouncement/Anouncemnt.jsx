
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";


const Announcement= () => {
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
    <div className="my-6 px-4 lg:px-8">
      <h2 className="text-xl font-semibold mb-4">📢 Latest Announcements</h2>
      <div className="grid gap-4">
        {announcements.map((a) => (
          <div key={a._id} className="border rounded-xl p-4 shadow bg-base-100">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={a.authorImage}
                alt={a.authorName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h4 className="font-medium">{a.authorName}</h4>
                <p className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <h3 className="text-lg font-bold">{a.title}</h3>
            <p className="text-sm mt-2">{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcement;
