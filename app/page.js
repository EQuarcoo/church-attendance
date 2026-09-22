import Link from 'next/link';

const cards = [
  { href: '/register', title: 'Register a member', desc: 'Add a new member with full details.' },
  { href: '/members', title: 'Members', desc: 'View, print cards, and check attendance history.' },
  { href: '/checkin', title: 'Check in', desc: 'Scan QR codes for Sunday attendance.' },
  { href: '/dashboard', title: 'Dashboard', desc: "This Sunday's numbers at a glance." },
  { href: '/followup', title: 'Follow-up', desc: 'Members who need a visit or a call.' },
];

export default function Home() {
  return (
    <main className="p-6 md:p-10 max-w-4xl">
      <h1 className="text-lg font-semibold text-black dark:text-white mb-1">Overview</h1>
      <p className="text-sm text-black/40 dark:text-white/40 mb-8">Everything you need to run Sunday check-in.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="block border border-black/10 dark:border-white/10 rounded-lg p-5 bg-black/[0.015] dark:bg-white/[0.02] hover:border-green-500/50 transition-colors"
          >
            <h2 className="text-sm font-semibold text-black dark:text-white mb-1">{c.title}</h2>
            <p className="text-xs text-black/40 dark:text-white/40">{c.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}