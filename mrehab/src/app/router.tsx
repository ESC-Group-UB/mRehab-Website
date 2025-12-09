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
import ForgotPassword from './pages/ForgotPassword';
import PatientDashboard from './pages/patientDashboard';
import BuyNowConfirm from './pages/BuyNowConfirm';
import BuyNowSucess from './pages/BuyNowSucess';
import IntrestForm from './pages/IntrestForm';
import ShoppingCartPage from './pages/Shopping/shopping-cart';
import ProductInfoPage from './pages/Shopping/featured';
import ShoppingPage from './pages/Shopping/shopping';
import ProfilePage from './pages/Profile/ProfilePage';

import ThankYou from './pages/thankyou';

import Landing from './pages/landing';
const AppRouter: React.FC = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/technologies/3Dprinting" element={<Technologies3DPrinting />} />
]            <Route path="/thankyou" element={<ThankYou />} />
            <Route path="/buy-now" element={<BuyNow />} />
            <Route path="/buy-now/confirm" element={<BuyNowConfirm />} /> {/* Adding the BuyNowConfirm route */}
            <Route path="/buy-now/success" element={<BuyNowSucess />} /> {/* Adding the BuyNowSuccess route */}

            <Route path="/for-providers" element={<ForProviders />} />  
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/start" element={<StartNow />} />
            <Route path="/user-stories" element={<UserStories />} />
            <Route path="/dashboard" element={<Dashboard />} /> {/* Adding the Dashboard route */}
            <Route path="/login" element={<Login />} /> {/* Adding the Login route */}
            <Route path="/signup" element={<Signup />} /> {/* Adding the Signup route */}
            <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Adding the ForgotPassword route */}
            <Route path="/patient-dashboard" element={<PatientDashboard />} /> {/* Adding the PatientDashboard route */}
            <Route path="/interest-form" element={<IntrestForm />} /> {/* Adding the Interest Form route */}
            {/* Add more routes as needed */}

            {/* shooping features */}   
            <Route path="/shopping/cart" element={<ShoppingCartPage />} />
            <Route path="/shopping/info" element={<ProductInfoPage />} />
            <Route path="/shopping" element={<ShoppingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
        </Routes>
    </Router>
);

export default AppRouter;