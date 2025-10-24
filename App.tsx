import React, { useState } from 'react';
import { BrandBible } from './types';
import { generateBrandIdentity, generateLogo } from './services/geminiService';
import { Loader } from './components/Loader';
import { BrandBibleDisplay } from './components/BrandBibleDisplay';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { ThemeToggle } from './components/ThemeToggle';
import { Chatbot } from './components/Chatbot';

function App() {
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [brandBible, setBrandBible] = useState<BrandBible | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !companyDescription) {
      setError("Please fill out both fields.");
      return;
    }
    setIsLoading(true);
    setBrandBible(null);
    setError(null);

    try {
      setStatus('Generating brand identity...');
      const identity = await generateBrandIdentity(companyName, companyDescription);

      setStatus('Creating primary logo...');
      const primaryLogoBytes = await generateLogo(identity.logoPrompt);
      const primaryLogoUrl = `data:image/png;base64,${primaryLogoBytes}`;

      setStatus('Designing secondary marks...');
      const secondaryMarkUrls: string[] = [];
      const secondaryPrompts = [
        `An icon-only version of the logo for: ${identity.logoPrompt}`,
        `A wordmark version of the logo for: ${identity.companyName}`,
        `A favicon or app icon for: ${identity.logoPrompt}`,
      ];

      for (const prompt of secondaryPrompts) {
          try {
              const secondaryLogoBytes = await generateLogo(prompt);
              secondaryMarkUrls.push(`data:image/png;base64,${secondaryLogoBytes}`);
          } catch (logoError) {
              console.warn(`Could not generate a secondary mark for prompt: "${prompt}"`, logoError);
          }
      }

      setBrandBible({
        ...identity,
        primaryLogoUrl,
        secondaryMarkUrls
      });

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
      setStatus('');
    }
  };

  const handleReset = () => {
    setBrandBible(null);
    setCompanyName('');
    setCompanyDescription('');
    setError(null);
  };

  return (
    <>
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Brand Bible Generator
            </h1>
            <p className="text-muted-foreground mt-2">
              Instantly create a complete brand identity using AI.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <main>
          {!brandBible && !isLoading && (
            <Card>
              <CardHeader>
                <CardTitle>Describe Your Business</CardTitle>
                <CardDescription>Tell us about your company and we'll generate a brand identity for you.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="companyName" className="font-medium">Company Name</label>
                    <Input
                      id="companyName"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g., 'Starlight Coffee'"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="companyDescription" className="font-medium">Company Description</label>
                    <Textarea
                      id="companyDescription"
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      placeholder="e.g., 'A cozy, eco-friendly coffee shop that serves artisanal, locally-sourced coffee and pastries. We aim to be a community hub for creatives and remote workers.'"
                      rows={5}
                      required
                    />
                  </div>
                  {error && <p className="text-destructive text-sm">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    Generate Brand Bible
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {isLoading && <Loader status={status} />}
          
          {brandBible && !isLoading && (
            <div>
              <BrandBibleDisplay brandBible={brandBible} />
              <div className="text-center mt-12">
                <Button onClick={handleReset} variant="outline">
                  Create a New Brand Bible
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
      <Chatbot />
    </>
  );
}

export default App;
