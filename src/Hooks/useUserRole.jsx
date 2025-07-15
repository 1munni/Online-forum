import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: roleData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !!user?.email && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users-role/${user.email}/role`);
      return res.data;
    }
  });

  return {
    role: roleData?.role || 'user',
    isRoleLoading: isLoading || authLoading,
    isAdmin: roleData?.role === 'admin',
    isUser: roleData?.role === 'user',
    error,
    refetchRole: refetch  // <-- Expose refetch
  };
};

export default useUserRole;
