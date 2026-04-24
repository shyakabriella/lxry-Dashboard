function SectionTabs({ sectionLabels, activeSection, switchSection }) {
  return (
    <div className="grid grid-cols-4 gap-1 rounded-xl border bg-slate-100 p-1">
      {Object.entries(sectionLabels).map(([key, label]) => (
        <button
          key={key}
          onClick={() => switchSection(key)}
          className={`text-[10px] p-2 rounded-lg ${
            activeSection === key ? "bg-white shadow" : ""
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}