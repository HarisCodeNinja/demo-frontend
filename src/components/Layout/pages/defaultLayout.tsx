import React from 'react';
import UnifiedLayout from './unifiedLayout';
import { defaultLayoutConfig } from '../layoutconfig';

const DefaultLayout: React.FC = () => {
  return <UnifiedLayout config={defaultLayoutConfig} />;
};

export default DefaultLayout;
