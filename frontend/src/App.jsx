import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SoilInput from './pages/SoilInput';
import AnalysisDashboard from './pages/AnalysisDashboard';
import CropRecommendations from './pages/CropRecommendations';
import FertilizerPlan from './pages/FertilizerPlan';
import WeatherPage from './pages/WeatherPage';
import MarketInsights from './pages/MarketInsights';
import GovernmentSchemes from './pages/GovernmentSchemes';
import FarmingCalendar from './pages/FarmingCalendar';
import SubsidyTracker from './pages/SubsidyTracker';
import LossRecovery from './pages/LossRecovery';
import BioFertilizer from './pages/BioFertilizer';
import ProfitTrees from './pages/ProfitTrees';
import DirectMarket from './pages/DirectMarket';
import DiseaseScanner from './pages/DiseaseScanner';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './context/AuthContext';
import { AgriProvider } from './context/AgriContext';
import FarmerVoiceAssistant from './components/FarmerVoiceAssistant';

function App() {
  return (
    <AuthProvider>
      <AgriProvider>
        <Router>
          <div className="min-h-screen bg-[#f8faf8]">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/soil-input" element={<SoilInput />} />
                <Route path="/analysis" element={<AnalysisDashboard />} />
                <Route path="/crops" element={<CropRecommendations />} />
                <Route path="/disease" element={<DiseaseScanner />} />
                <Route path="/fertilizer" element={<FertilizerPlan />} />
                <Route path="/bio-inputs" element={<BioFertilizer />} />
                <Route path="/recovery" element={<LossRecovery />} />
                <Route path="/agroforestry" element={<ProfitTrees />} />
                <Route path="/direct-market" element={<DirectMarket />} />
                <Route path="/weather" element={<WeatherPage />} />
                <Route path="/market" element={<MarketInsights />} />
                <Route path="/schemes" element={<GovernmentSchemes />} />
                <Route path="/calendar" element={<FarmingCalendar />} />
                <Route path="/subsidy-tracker" element={<SubsidyTracker />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Routes>
            </main>
            <FarmerVoiceAssistant />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: { background: '#1b5e20', color: '#fff', borderRadius: '12px', fontFamily: 'Outfit' },
                success: { iconTheme: { primary: '#66bb6a', secondary: '#fff' } }
              }}
            />
          </div>
        </Router>
      </AgriProvider>
    </AuthProvider>
  );
}

export default App;

