import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import clsx from "clsx";

export interface ScoreSegment {
  label: string;
  value: number;
  color: string; // tailwind bg-* class
}

export interface FindingItem {
  status: "pass" | "warn" | "fail";
  title: string;
  detail?: string;
}

interface ScoreReportCardProps {
  scoreLabel: string;
  scoreValue: number;
  segments: ScoreSegment[];
  findings: FindingItem[];
}

const STATUS_ICON = {
  pass: <CheckCircle2 className="w-4 h-4 text-sel shrink-0" />,
  warn: <AlertTriangle className="w-4 h-4 text-sel/50 shrink-0" />,
  fail: <XCircle className="w-4 h-4 text-ink/25 shrink-0" />,
};

export function ScoreReportCard({ scoreLabel, scoreValue, segments, findings }: ScoreReportCardProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  return (
    <div className="border border-ink/8 dark:border-white/10 rounded-[16px] bg-paper dark:bg-bg p-7 shadow-soft dark:shadow-soft-dark space-y-7">
      <div>
        <div className="flex items-baseline justify-between">
          <span className="stat-num text-[46px] text-ink">{scoreValue}%</span>
          <span className="text-sm text-grey font-medium tracking-[0.01em]">{scoreLabel}</span>
        </div>

        <div className="mt-5 h-2 w-full rounded-full overflow-hidden flex bg-ink/[0.04] dark:bg-white/[0.06]">
          {segments.map((s, i) => (
            <div
              key={i}
              className={clsx(s.color)}
              style={{ width: `${(s.value / total) * 100}%` }}
              title={`${s.label}: ${s.value}`}
            />
          ))}
        </div>

        <div className="mt-3.5 flex flex-wrap gap-x-6 gap-y-2">
          {segments.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-grey">
              <span className={clsx("w-2 h-2 rounded-full", s.color)} />
              <span className="text-ink font-medium">{s.label}</span>
              <span>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {findings.length > 0 && (
        <div className="space-y-3.5 pt-6 border-t border-ink/8 dark:border-white/10">
          {findings.map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              {STATUS_ICON[f.status]}
              <div>
                <p className="text-sm font-medium text-ink leading-[1.4]">{f.title}</p>
                {f.detail && <p className="text-[13px] text-grey mt-1 leading-[1.5]">{f.detail}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
