import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Technologies3DPrinting from './pages/Technologies3DPrinting';
import { BuyNow } from './pages/buyNow';
import { ForProviders } from './pages/forProdivders';
import { HowItWorks } from './pages/HowItWorks';
import { StartNow } from './pages/startNow';
import { UserStories } from './pages/userStories';
import Dashboard from './pages/dashboard'; // Importing the Dashboard component
import Login from './pages/login';
import Signup from './pages/Signup';

import ThankYou from './pages/thankyou';

import Landing from './pages/landing';
const AppRouter: React.FC = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/technologies/3Dprinting" element={<Technologies3DPrinting />} />
]            <Route path="/thankyou" element={<ThankYou />} />
            <Route path="/buy-now" element={<BuyNow />} />
            <Route path="/for-providers" element={<ForProviders />} />  
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/start" element={<StartNow />} />
            <Route path="/user-stories" element={<UserStories />} />
            <Route path="/dashboard" element={<Dashboard />} /> {/* Adding the Dashboard route */}
            <Route path="/login" element={<Login />} /> {/* Adding the Login route */}
            <Route path="/signup" element={<Signup />} /> {/* Adding the Signup route */}
            {/* Add more routes as needed */}
        </Routes>
    </Router>
);

export default AppRouter;