import { useState, useEffect, useCallback } from 'react';
import {
  fetchBasicDetails,
  fetchHeader,
  fetchSkills,
  fetchExperience,
  fetchProjects,
  fetchEducation,
  fetchSocials,
  fetchAdditionalInfo,
  fetchDocumentation,
  fetchCommonLayout,
  fetchAnalytics,
} from '../services/api';

/**
 * Custom Hook: useProfile
 * Implements Progressive Module Loading (PML) architecture.
 * Fetches core data first for instant visibility, then hydrates other modules.
 */
const useProfile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const hydrateFragment = (fragment) => {
    setProfile((prev) => ({ ...prev, ...fragment }));
  };

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // PHASE 1: Critical UI Path (Global Layout: Header & Footer)
      // Fetches navigation, identity, and social links in a single request
      const layout = await fetchCommonLayout();

      setProfile((prev) => ({ ...prev, ...layout }));
      setMaintenanceMode(layout.maintenanceMode || false);

      // Initial load is "complete" once we have the layout basics
      setLoading(false);

      // Helper for slight delay to make progressive loading visible
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      // PHASE 2: Background Hydration (Core Content Modules)
      // We load critical content modules first to ensure they appear on screen as soon as possible.
      const fragments = [
        { key: 'analytics', fetcher: fetchAnalytics },
        { key: 'documentation', fetcher: fetchDocumentation },
        { key: 'projects', fetcher: fetchProjects },
        { key: 'experience', fetcher: fetchExperience },
        { key: 'education', fetcher: fetchEducation },
        { key: 'basic', fetcher: fetchBasicDetails },
        { key: 'skills', fetcher: fetchSkills },
        { key: 'socials', fetcher: fetchSocials },
        { key: 'additional', fetcher: fetchAdditionalInfo },
      ];

      // Progressively hydrate the profile state
      for (const frag of fragments) {
        try {
          const data = await frag.fetcher();
          if (data) {
            // Logic: If the backend returns a direct array (like Projects or Experience),
            // we must wrap it in the correct key before merging into the profile.
            const fragmentToMerge = Array.isArray(data) ? { [frag.key]: data } : data;
            hydrateFragment(fragmentToMerge);
          }
        } catch (err) {
          console.warn(`[PML] Failed to hydrate ${frag.key}:`, err.message);
        }
      }
    } catch (err) {
      console.error('PML_HYDRATION_FAILURE:', err.message);
      setError(err);
      setErrorType('network');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return { profile, loading, error, errorType, maintenanceMode, retry: fetchAllData };
};

export default useProfile;
