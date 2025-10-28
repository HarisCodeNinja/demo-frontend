import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from '@/util/RequireAuth';
import HomePage from '@/routers/common/home';
import NotAuthPage from '@/routers/common/notAuth';
import NotFoundPage from '@/routers/common/notFound';
import { useAppSelector } from '@/store';
import { areaConfigurations } from '@/config/areas/areaConfig';
import { AppArea } from '@/hooks/useCurrentArea';
import { Spinner } from '../ui/spinner';

interface AppProps {
  doc: HTMLElement;
}
const AppRoutes: React.FC<AppProps> = ({ doc }) => {
  const { dir, isLoggedIn, user, area } = useAppSelector((state: any) => state.session);
  doc.dir = dir === 'rtl' ? 'rtl' : 'ltr';

  const defaultAreaAccess: string[] = ['user:admin', 'user:hr', 'user:manager', 'user:employee'];

  // Helper function to render routes for a specific area
  const renderAreaRoutes = (areaKey: AppArea) => {
    const config = areaConfigurations[areaKey];
    const Layout = config.layout;

    return (
      <Route element={<Layout />}>
        <Route key="notAuth" path="/notAuth" element={<NotAuthPage />} />

        {config.requiresAuth ? (
          <Route element={<RequireAuth />}>
            <Route key="home" path="/" element={<HomePage />} />
            {config.routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center h-1/2">
                        <Spinner />
                      </div>
                    }>
                    <route.component />
                  </Suspense>
                }
              />
            ))}
          </Route>
        ) : (
          config.routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-1/2">
                      <Spinner />
                    </div>
                  }>
                  <route.component />
                </Suspense>
              }
            />
          ))
        )}

        <Route key="notfound" path="*" element={<NotFoundPage />} />
      </Route>
    );
  };

  return (
    <Routes>
      {user && isLoggedIn && user.scope.some((role: string) => defaultAreaAccess.includes(role)) && renderAreaRoutes('default')}

      {!isLoggedIn && renderAreaRoutes('public')}
    </Routes>
  );
};

export default AppRoutes;
