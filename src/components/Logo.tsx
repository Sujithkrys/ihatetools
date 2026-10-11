import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 28, className = "" }: LogoProps) {
  return (
    <>
      <Image
        src="/logo-light.png"
        alt="ihatetools"
        width={size}
        height={size}
        className={`block dark:hidden rounded-[7px] ${className}`}
        priority
      />
      <Image
        src="/logo-dark.png"
        alt="ihatetools"
        width={size}
        height={size}
        className={`hidden dark:block rounded-[7px] ${className}`}
        priority
      />
    </>
  );
}
