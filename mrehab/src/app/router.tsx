import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TechnologiesMobileApp from './pages/technologies-mobileapp';
import Technologies3DPrinting from './pages/Technologies3DPrinting';
import WhyItMatters from './pages/WhyItMatters';
import { BuyNow } from './pages/buyNow';
import { ForProviders } from './pages/forProdivders';
import { HowItWorks } from './pages/HowItWorks';
import { StartNow } from './pages/startNow';
import { UserStories } from './pages/userStories';
import Dashboard from './pages/dashboard'; // Importing the Dashboard component

import ThankYou from './pages/thankyou';

import Landing from './pages/landing';
const AppRouter: React.FC = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/technologies/mobileapp" element={<TechnologiesMobileApp />} />
            <Route path="/technologies/3Dprinting" element={<Technologies3DPrinting />} />
            <Route path="/why-it-matters" element={<WhyItMatters />} />
            <Route path="/thankyou" element={<ThankYou />} />
            <Route path="/buy-now" element={<BuyNow />} />
            <Route path="/for-providers" element={<ForProviders />} />  
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/start" element={<StartNow />} />
            <Route path="/user-stories" element={<UserStories />} />
            <Route path="/dashboard" element={<Dashboard />} /> {/* Adding the Dashboard route */}
            {/* Add more routes as needed */}
        </Routes>
    </Router>
);

export default AppRouter;