import { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headerAction?: ReactNode;
  bgWhite?: boolean;
  textAlign?: "left" | "center" | "right";
}

export default function SectionWrapper({ 
  children, 
  title, 
  subtitle, 
  className = "", 
  headerAction,
  bgWhite = false,
  textAlign = "left"
}: SectionWrapperProps) {
  const isCenter = textAlign === "center";
  const isRight = textAlign === "right";

  const headerLayoutClass = isCenter
    ? "flex flex-col items-center text-center justify-center gap-4 mb-12"
    : isRight
      ? "flex flex-col md:flex-row-reverse md:items-end justify-between gap-6 mb-12 border-r-8 border-primary pr-6 text-right rounded-sm ml-auto"
      : "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-l-8 border-primary pl-6 rounded-sm";

  return (
    <section className={`py-16 lg:py-24 ${bgWhite ? "bg-white dark:bg-gray-950" : "bg-gray-50 dark:bg-gray-900"} ${className}`}>
      <div className="container mx-auto px-4">
        {(title || subtitle || headerAction) && (
          <div className={headerLayoutClass}>
            <div>
              {title && <h2 data-field="title" className="text-3xl lg:text-4xl font-black mb-2 text-gray-900 dark:text-white cursor-text">{title}</h2>}
              {subtitle && <p data-field="subtitle" className="text-gray-500 dark:text-gray-400 text-lg font-medium cursor-text">{subtitle}</p>}
            </div>
            {headerAction && (
              <div>{headerAction}</div>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
