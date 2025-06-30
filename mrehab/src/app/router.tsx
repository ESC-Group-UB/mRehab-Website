import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TechnologiesMobileApp from './pages/technologies-mobileapp';
import Technologies3DPrinting from './pages/Technologies3DPrinting';
import WhyItMatters from './pages/WhyItMatters';
import Enroll from './pages/enroll';
import ThankYou from './pages/thankyou';

import Landing from './pages/landing';
const AppRouter: React.FC = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/technologies/mobileapp" element={<TechnologiesMobileApp />} />
            <Route path="/technologies/3Dprinting" element={<Technologies3DPrinting />} />
            <Route path="/why-it-matters" element={<WhyItMatters />} />
            <Route path="/enroll" element={<Enroll />} />
            <Route path="/thankyou" element={<ThankYou />} />
            
            {/* Add more routes as needed */}
            {/* Example: <Route path="/about" element={<About />} /> */}
            {/* Add more routes as needed */}

        </Routes>
    </Router>
);

export default AppRouter;