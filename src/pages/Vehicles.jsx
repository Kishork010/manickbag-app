import { useLocation } from "react-router-dom";

export default function Vehicles() {
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const type = query.get("type"); // sedan, suv, etc

  return (
    <div>
      <h2>All Vehicles</h2>

      {type && <h3>Showing: {type.toUpperCase()}</h3>}

      {/* filter your vehicle data based on type */}
    </div>
  );
}