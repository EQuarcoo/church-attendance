export function Field({ label, name, type, required, defaultValue }) {
  return (
    <div>
      <label className="block text-[11px] font-medium uppercase tracking-wide text-black/40 dark:text-white/40 mb-1.5">
        {label} {required ? <span className="text-green-500">*</span> : ''}
      </label>
      <input
        type={type || 'text'}
        name={name}
        required={required || false}
        defaultValue={defaultValue}
        className="w-full bg-transparent border border-black/15 dark:border-white/15 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-green-500 transition-colors"
      />
    </div>
  );
}

export function Select({ label, name, options, defaultValue }) {
  return (
    <div>
      <label className="block text-[11px] font-medium uppercase tracking-wide text-black/40 dark:text-white/40 mb-1.5">
        {label}
      </label>
      <select
        name={name}
        defaultValue={defaultValue || ''}
        className="w-full bg-transparent border border-black/15 dark:border-white/15 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-green-500 transition-colors"
      >
        <option value="">—</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-white dark:bg-[#0B0E14]">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SectionRow({ title, desc, children }) {
  return (
    <div className="grid md:grid-cols-[200px_1fr] gap-4 md:gap-8 py-6 border-b border-black/10 dark:border-white/10 last:border-b-0">
      <div>
        <h2 className="text-sm font-semibold text-black dark:text-white">{title}</h2>
        {desc && <p className="text-xs text-black/40 dark:text-white/40 mt-1">{desc}</p>}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

export function Panel({ children, className = '' }) {
  return (
    <div
      className={`border border-black/10 dark:border-white/10 rounded-lg bg-black/[0.015] dark:bg-white/[0.02] ${className}`}
    >
      {children}
    </div>
  );
}