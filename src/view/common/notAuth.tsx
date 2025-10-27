import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotAuthPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex flex-col gap-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <Lock className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl font-bold text-center mx-auto">Access Denied</CardTitle>
          <CardDescription className="text-lg">You don't have permission to access this page. Please log in with the appropriate credentials.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate('/')} className="w-full">
              <Home className="h-4 w-4 me-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotAuthPage;