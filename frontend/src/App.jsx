import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Vehicles from "./pages/Vehicles";
import Services from "./pages/Services";
import Showrooms from "./pages/Showrooms";
import Contact from "./pages/Contact";

// Service sub-pages
import AMC from "./pages/AMC";
import EW from "./pages/EW";
import VAS from "./pages/VAS";
import Finance from "./pages/Finance";
import RSA from "./pages/RSA";

// NEW pages
import Accessories from "./pages/Accessories";
import Insurance from "./pages/Insurance";
import FASTag from "./pages/FASTag";
import Service from "./pages/Service";

import Heritage from "./pages/Heritage";
import CurrentOffers   from "./pages/CurrentOffers";
import CorporateDeals  from "./pages/CorporateDeals";
import ExchangeBonus   from "./pages/ExchangeBonus";
import FinanceSchemes  from "./pages/FinanceSchemes";
import IPLPage from "./pages/IPLPage";

// ✅ FIXED — single clean import, no duplicate
import ShowroomPage from "./pages/ShowroomPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Vehicles */}
        <Route path="/vehicles" element={<Vehicles />} />

        {/* Services hub */}
        <Route path="/services" element={<Services />} />

        {/* Service sub-pages — all accessible from Vehicles > Other Services */}
        <Route path="/service"            element={<Service />} />       {/* Book Service */}
        <Route path="/amc"                element={<AMC />} />
        <Route path="/extended-warranty"  element={<EW />} />
        <Route path="/vas"                element={<VAS />} />
        <Route path="/accessories"        element={<Accessories />} />
        <Route path="/insurance"          element={<Insurance />} />
        <Route path="/fastag"             element={<FASTag />} />
        <Route path="/rsa"                element={<RSA />} />

        {/* Finance */}
        <Route path="/finance" element={<Finance />} />

        {/* Showrooms & Contact */}
        <Route path="/showrooms" element={<Showrooms />} />
        <Route path="/contact"   element={<Contact />} />

        {/* ✅ FIXED — single outlet route, handles all city pages */}
        <Route path="/showrooms/:outletKey" element={<ShowroomPage />} />

        <Route path="/heritage/*" element={<Heritage />} />
        <Route path="/current-offers"   element={<CurrentOffers />} />
        <Route path="/corporate-deals"  element={<CorporateDeals />} />
        <Route path="/exchange-bonus"   element={<ExchangeBonus />} />
        <Route path="/finance-schemes"  element={<FinanceSchemes />} />

        <Route path="/ipl" element={<IPLPage />} />
      </Routes>
    </Router>
  );
}