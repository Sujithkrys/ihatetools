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
  pass: <CheckCircle2 className="w-4 h-4 text-green shrink-0" />,
  warn: <AlertTriangle className="w-4 h-4 text-yellow shrink-0" />,
  fail: <XCircle className="w-4 h-4 text-pink shrink-0" />,
};

export function ScoreReportCard({ scoreLabel, scoreValue, segments, findings }: ScoreReportCardProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  return (
    <div className="border border-ink/8 dark:border-white/10 rounded-[16px] bg-paper dark:bg-bg p-6 shadow-soft dark:shadow-soft-dark space-y-6">
      <div>
        <div className="flex items-baseline justify-between">
          <span className="stat-num text-[44px] text-ink">{scoreValue}%</span>
          <span className="text-sm text-grey font-medium">{scoreLabel}</span>
        </div>

        <div className="mt-4 h-2.5 w-full rounded-full overflow-hidden flex bg-ink/5">
          {segments.map((s, i) => (
            <div
              key={i}
              className={clsx(s.color)}
              style={{ width: `${(s.value / total) * 100}%` }}
              title={`${s.label}: ${s.value}`}
            />
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
          {segments.map((s, i) => (
            <div key={i} className="flex items-center gap-1.5 text-sm text-grey">
              <span className={clsx("w-2 h-2 rounded-full", s.color)} />
              <span className="text-ink font-medium">{s.label}</span>
              <span>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {findings.length > 0 && (
        <div className="space-y-2.5 pt-4 border-t border-ink/10">
          {findings.map((f, i) => (
            <div key={i} className="flex items-start gap-2.5">
              {STATUS_ICON[f.status]}
              <div>
                <p className="text-sm font-medium text-ink">{f.title}</p>
                {f.detail && <p className="text-xs text-grey mt-0.5">{f.detail}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
