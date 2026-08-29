export default function MobileConnector({ active, className = "" }) {
  return (
    <div className={`w-px mx-auto relative overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="connector-bar absolute inset-0 origin-top"
        style={{
          background: "linear-gradient(180deg, rgba(255,84,104,.05), rgba(255,84,104,.55), rgba(255,84,104,.05))",
          transform: active ? "scaleY(1)" : "scaleY(0)",
        }}
      />
    </div>
  );
}
