import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AssessmentProvider } from './context/assessmentContext';

const StartPage = lazy(() => import('./components/startPage'));
const LandingPage = lazy(() => import('./components/landingPage'));
const ProductMaturityDesignForm = lazy(() => import('./components/productMaturityDesignForm'));
const Dashboard = lazy(() => import('./components/dashboard'));
const Report = lazy(() => import('./components/report'));
const Roadmap = lazy(() => import('./components/roadmap'));
const SummaryResults = lazy(() => import('./components/summaryResults'));

function App() {
  return (
    <AssessmentProvider>
      <Router>
        <Suspense fallback={<> </>}>
          <Routes>
            <Route path="/" element={<LandingPage />} /> Landing page route
            <Route path="/start" element={<StartPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assessment" element={<ProductMaturityDesignForm />} />
            {/* <Route path="/summary" element={<SummaryResults />} />
            <Route path="/report" element={<Report />} />
            <Route path="/roadmap" element={<Roadmap />} /> */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </Suspense>
      </Router>
    </AssessmentProvider>
  );
}

export default App;
