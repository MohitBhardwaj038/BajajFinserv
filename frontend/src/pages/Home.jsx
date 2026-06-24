import { useState } from 'react';
import { postBfhl } from '../services/api';
import HeroSection from '../components/HeroSection';
import InputArea from '../components/InputArea';
import Spinner from '../components/Spinner';
import ErrorAlert from '../components/ErrorAlert';
import ResponseDisplay from '../components/ResponseDisplay';

/**
 * Main page — ties together hero, input, and response sections.
 */
export default function Home() {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (edges) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await postBfhl(edges);
      setResponse(result);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Decorative background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary-700/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent-400/8 blur-[100px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-primary-500/5 blur-[80px]" />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <HeroSection />

        {/* Input Section */}
        <div className="mb-10">
          <InputArea onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Loading */}
        {isLoading && <Spinner message="Building hierarchies…" />}

        {/* Error */}
        {error && (
          <div className="mb-8 max-w-2xl mx-auto">
            <ErrorAlert message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {/* Response */}
        {response && <ResponseDisplay data={response} />}
      </div>

      {/* Footer */}
      <footer className="text-center mt-20 pb-8">
        <p className="text-xs text-white/20">
          Chitkara Full Stack Engineering Challenge &bull; Built with React + Vite + Tailwind
        </p>
      </footer>
    </div>
  );
}
