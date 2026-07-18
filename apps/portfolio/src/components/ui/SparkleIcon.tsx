import Image from "next/image";

interface SparkleIconProps {
  className?: string;
  size?: number;
}

export default function SparkleIcon({
  className = "",
  size = 16,
}: SparkleIconProps) {
  return (
    <Image
      src="/sparkle.png"
      alt=""
      width={size}
      height={size}
      className={`block shrink-0 ${className}`}
      aria-hidden="true"
    />
  );
}
