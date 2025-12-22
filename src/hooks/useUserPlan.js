import useAuth from './useAuth';

const useUserPlan = () => {
  const { userDetails, loading } = useAuth();

  return {
    isPremium: userDetails?.isPremium || false,
    role: userDetails?.role || 'user',
    isAdmin: userDetails?.role === 'admin',
    loading,
  };
};

export default useUserPlan;
