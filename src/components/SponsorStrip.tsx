const SPONSORS = [
  { name: "GrowthX", url: "https://growthx.club", logo: "/sponsors/growthx.png" },
  { name: "HomeRun", url: "https://home-run.co", logo: "/sponsors/homerun.png" },
  { name: "Equal AI", url: "https://myequal.ai", logo: "/sponsors/equalai.svg" },
];

export function SponsorStrip() {
  return (
    <div className="mb-10 pb-8 border-b border-ink/[0.06] dark:border-white/[0.06]">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[13px] font-semibold text-ink">Try these tools</span>
        <span className="text-[10px] font-medium text-grey/70 uppercase tracking-wide border border-ink/10 dark:border-white/10 rounded-full px-2 py-0.5">
          Sponsored
        </span>
      </div>
      <p className="text-[13px] text-grey mb-5 max-w-[520px]">
        A few teams we&apos;re partnering with, worth a look.
      </p>
      <div className="flex flex-wrap items-start gap-8">
        {SPONSORS.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group flex flex-col items-center gap-2 no-underline"
            title={s.name}
            aria-label={`Visit ${s.name} (sponsored)`}
          >
            <span className="flex items-center justify-center h-14 w-14 rounded-xl bg-white border border-ink/10 shadow-sm p-2 transition-transform group-hover:-translate-y-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.logo}
                alt={s.name}
                className="max-h-full max-w-full w-auto h-auto object-contain"
              />
            </span>
            <span className="text-[11px] font-medium text-grey">{s.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
