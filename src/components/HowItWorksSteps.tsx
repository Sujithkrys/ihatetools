interface Step {
  title: string;
  description: string;
}

interface HowItWorksStepsProps {
  steps: Step[];
}

export function HowItWorksSteps({ steps }: HowItWorksStepsProps) {
  return (
    <div className="w-full max-w-5xl mx-auto my-16 px-4">
      <h2 className="disp text-2xl text-ink text-center mb-10">
        How it works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6 bg-paper border border-ink/8 dark:border-white/10 rounded-[14px] shadow-soft dark:shadow-soft-dark"
          >
            <div className="w-11 h-11 flex items-center justify-center rounded-full bg-ink/5 dark:bg-white/5 font-sans font-semibold text-[13px] text-ink mb-6">
              {String(index + 1).padStart(2, '0')}
            </div>
            <h3 className="disp text-lg mb-3 text-ink">
              {step.title}
            </h3>
            <p className="text-grey text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
