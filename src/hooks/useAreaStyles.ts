import { useEffect } from 'react';
import { useCurrentArea } from './useCurrentArea';

// Import all area stylesheets at build time
import '@/style/main.scss';
// import '@/style/areas/areaScoping.scss';
// Import other area styles here as you add them

/**
 * Hook that manages area-specific CSS classes and styling
 * This ensures the correct styles are applied based on the current area
 */
export const useAreaStyles = () => {
	const currentArea = useCurrentArea();

	useEffect(() => {
		const body = document.body;

		// Remove all area classes first
		body.classList.remove('area-public', 'area-default');
		// Add more area classes here as you create them

		// Add the current area class
		body.classList.add(`area-${currentArea}`);

		// Cleanup function to remove classes when component unmounts
		return () => {
			body.classList.remove(`area-${currentArea}`);
		};
	}, [currentArea]);

	return {
		currentArea,
		areaClass: `area-${currentArea}`,
	};
};

export default useAreaStyles;
