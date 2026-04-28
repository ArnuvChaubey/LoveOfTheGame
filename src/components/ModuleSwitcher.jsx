const moduleOptions = [
  { id: "food_rescue", icon: "🍽️", color: "#16a34a", name: "Food Rescue" },
  { id: "blood_donation", icon: "🩸", color: "#dc2626", name: "Blood Donation" },
  { id: "disaster_relief", icon: "🚨", color: "#ea580c", name: "Disaster Relief" },
];

export default function ModuleSwitcher({ activeModule, onSwitch }) {
  return (
    <select
      className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white"
      value={activeModule}
      onChange={(e) => onSwitch(e.target.value)}
    >
      {moduleOptions.map((option) => (
        <option key={option.id} value={option.id}>
          {option.icon} {option.name}
        </option>
      ))}
    </select>
  );
}
