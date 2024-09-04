// client/src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AssessmentProvider } from './context/assessmentContext';

// Lazy load components
const ProductMaturityForm = lazy(() => import('./components/productMaturityForm'));
const Report = lazy(() => import('./components/report'));
const Roadmap = lazy(() => import('./components/roadmap'));
const SummaryResults = lazy(() => import('./components/summaryResults')); // Import the new SummaryResults component

function App() {
  return (
    <AssessmentProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<ProductMaturityForm />} />
            <Route path="/summary" element={<SummaryResults />} /> {/* New route for summary results */}
            <Route path="/report" element={<Report />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </Suspense>
      </Router>
    </AssessmentProvider>
  );
}

export default App;
