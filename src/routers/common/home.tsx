import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, Shield, Zap, Globe, Code, Database } from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Rocket className="h-8 w-8" />,
      title: 'Fast Development',
      description: 'Build applications quickly with our modern tech stack',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure by Default',
      description: 'Enterprise-grade security built into every component',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'High Performance',
      description: 'Optimized for speed and efficiency at scale',
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Global Ready',
      description: 'Multi-language support and international features',
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: 'Developer Friendly',
      description: 'Clean APIs and comprehensive documentation',
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: 'Scalable Architecture',
      description: 'Built to grow with your business needs',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Welcome to Our Platform</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Build amazing applications with our powerful, modern development platform. Experience the future of web development today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">We provide everything you need to build, deploy, and scale your applications</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="h-full">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10 text-primary">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="text-center p-8">
            <CardHeader>
              <CardTitle className="text-3xl mb-4">Ready to Get Started?</CardTitle>
              <CardDescription className="text-lg mb-8">Join thousands of developers building amazing applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" className="px-8">
                Start Your Journey
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
