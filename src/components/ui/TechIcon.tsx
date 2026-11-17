import React from 'react';
import { cn } from '@/src/lib/utils';

interface TechIconProps {
  name: string;
  className?: string;
}

/**
 * Renders an authentic custom SVG technology logo for each of the 25 portfolio skills.
 */
export const TechIcon: React.FC<TechIconProps> = ({ name, className = 'w-4 h-4' }) => {
  const svgClass = cn('shrink-0', className);

  switch (name) {
    case 'React.js':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <circle cx="12" cy="12" r="2.2" fill="currentColor" />
          <ellipse cx="12" cy="12" rx="10" ry="4.1" stroke="currentColor" strokeWidth="1.6" />
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="4.1"
            transform="rotate(60 12 12)"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="4.1"
            transform="rotate(120 12 12)"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      );

    case 'Next.js':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M8.5 16V8L16.8 18"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M15.5 8V12.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'Angular':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <path
            d="M12 2.5L3.5 5.5L4.8 16.8L12 21.5L19.2 16.8L20.5 5.5L12 2.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M12 6.5L7.8 16.2M12 6.5L16.2 16.2M9.2 13.2H14.8"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case '.NET Web Forms':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <rect
            x="2.5"
            y="4"
            width="19"
            height="16"
            rx="2.5"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M2.5 8.5H21.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="5.5" cy="6.25" r="0.8" fill="currentColor" />
          <circle cx="8" cy="6.25" r="0.8" fill="currentColor" />
          <rect x="5.5" y="11" width="5.5" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M13.5 12H18.5M13.5 15.5H17"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'C#':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <path
            d="M11 8.5C9.8 7.5 8 7.6 6.8 8.8C5.4 10.2 5.4 13.8 6.8 15.2C8 16.4 9.8 16.5 11 15.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M14.5 8V16M18 8V16M13 10.5H19.5M13 13.5H19.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );

    case '.NET Core':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <rect
            x="2.5"
            y="4.5"
            width="19"
            height="15"
            rx="3.5"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <circle cx="6.2" cy="15.2" r="1.1" fill="currentColor" />
          <path
            d="M9.5 15V9L14 15V9M17 9H20M17 12H19.5M17 15H20"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case '.NET Framework':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <path
            d="M3.5 16.5C5.5 16.5 7 7.5 9.5 7.5C12 7.5 12.5 16.5 15 16.5C17.2 16.5 18.5 10.5 20.5 7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M4 20H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="4" cy="16.5" r="1.1" fill="currentColor" />
        </svg>
      );

    case 'Node.js':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <path
            d="M12 2.5L20 7.1V16.9L12 21.5L4 16.9V7.1L12 2.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 15V9L14.5 15V9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'Express.js':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <path
            d="M4 12H11.2C11.2 9.4 9.6 7.8 7.5 7.8C5.4 7.8 3.8 9.6 3.8 12C3.8 14.5 5.4 16.2 7.7 16.2C9.2 16.2 10.3 15.6 10.9 14.6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 8.2L20 15.8M20 8.2L14 15.8"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'MS SQL Server':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <ellipse cx="12" cy="6" rx="7.5" ry="2.8" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M4.5 6V18C4.5 19.55 7.86 20.8 12 20.8C16.14 20.8 19.5 19.55 19.5 18V6"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M4.5 11.8C4.5 13.35 7.86 14.6 12 14.6C16.14 14.6 19.5 13.35 19.5 11.8"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M13.2 8.2L10.5 12.2H13L11.2 15.8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'Oracle DB':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <rect
            x="2.8"
            y="7.2"
            width="18.4"
            height="9.6"
            rx="4.8"
            stroke="currentColor"
            strokeWidth="2.1"
          />
        </svg>
      );

    case 'PostgreSQL':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <path
            d="M16.5 9.2C18.2 7.5 19.8 8.3 19.8 10.6C19.8 13.2 17.5 14.8 15.8 14.4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M7.5 9.2C5.8 7.5 4.2 8.3 4.2 10.6C4.2 13.2 6.5 14.8 8.2 14.4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M7.5 9.5C7.5 6.4 9.5 4.5 12 4.5C14.5 4.5 16.5 6.4 16.5 9.5C16.5 12.5 15.3 14.6 14 15.6V19C14 20 13.2 20.6 12.2 20.4C11.4 20.2 11 19.4 11 18.4V15.5C9.2 14.9 7.5 12.6 7.5 9.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="10.2" cy="9.5" r="0.9" fill="currentColor" />
          <circle cx="13.8" cy="9.5" r="0.9" fill="currentColor" />
        </svg>
      );

    case 'MySQL':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <path
            d="M4 17.5C6.5 13 9.2 7.2 13.5 6C15.8 5.4 17.5 6.5 18 8.2C16.2 8.2 14.8 9.2 14.2 10.6C16.2 10.8 18.2 12.2 19.5 14.8"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.8 6.5L13 4L14.8 5.8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.5 18.8C7.5 17.4 11.2 17.4 14.5 18.8C16.8 19.6 18.5 19.2 20 18.2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'MongoDB':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <path
            d="M12 2.5C12 2.5 6.5 7.5 6.5 13C6.5 16.8 9 19.5 12 20.5C15 19.5 17.5 16.8 17.5 13C17.5 7.5 12 2.5 12 2.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M12 7V21.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'Microsoft Azure':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <path
            d="M13.2 3.5L5.5 18.5H10.5L15.2 9.5L13.2 3.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M14.2 11.2L11.5 16.5L16.5 19.5H20.5L14.2 11.2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'AWS':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <path
            d="M6.8 13.5H17.4C19.3 13.5 20.8 12.1 20.8 10.2C20.8 8.5 19.5 7.1 17.8 6.9C17.1 4.6 15 3 12.4 3C9.6 3 7.3 5 6.8 7.6C4.8 7.9 3.2 9.5 3.2 11.5C3.2 12.7 4.2 13.5 6.8 13.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M5 17.2C8.8 20.2 14.8 20.2 18.8 17.2"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M16.8 16.5L19.4 17L18.5 19.6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'Tailwind CSS':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <path
            d="M6 10.5C6.8 7.8 8.6 6.5 11.4 6.5C14.8 6.5 15.4 9 17.4 9.3C18.7 9.5 19.8 8.8 20.5 7.5C19.7 10.2 17.9 11.5 15.1 11.5C11.7 11.5 11.1 9 9.1 8.7C7.8 8.5 6.7 9.2 6 10.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M3.5 16.5C4.3 13.8 6.1 12.5 8.9 12.5C12.3 12.5 12.9 15 14.9 15.3C16.2 15.5 17.3 14.8 18 13.5C17.2 16.2 15.4 17.5 12.6 17.5C9.2 17.5 8.6 15 6.6 14.7C5.3 14.5 4.2 15.2 3.5 16.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'shadcn/ui':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <path
            d="M19 12L12 19M16 5L5 16"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'Material UI':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <path
            d="M3.5 15.5V6.5L9.5 10.5L15.5 6.5V13.5L11.5 16V19L19.5 14.2V7.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="19.5" cy="5.5" r="1.2" fill="currentColor" />
        </svg>
      );

    case 'Bootstrap':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <path
            d="M6.5 4.5H17.5C18.6 4.5 19.5 5.4 19.5 6.5V9.5C19.5 10.6 20.3 11.6 21.2 12C20.3 12.4 19.5 13.4 19.5 14.5V17.5C19.5 18.6 18.6 19.5 17.5 19.5H6.5C5.4 19.5 4.5 18.6 4.5 17.5V14.5C4.5 13.4 3.7 12.4 2.8 12C3.7 11.6 4.5 10.6 4.5 9.5V6.5C4.5 5.4 5.4 4.5 6.5 4.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 8H12.8C14.1 8 14.9 8.7 14.9 9.8C14.9 10.8 14.2 11.5 13.1 11.7C14.4 11.9 15.2 12.7 15.2 13.9C15.2 15.2 14.3 16 12.8 16H9.5V8ZM9.5 11.8H12.7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'Redux':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <path
            d="M15.6 14.8C17.2 12.1 16.9 7.8 14.1 6.1C12.2 5 9.6 5.9 8.3 8.2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M8.8 14.5C11.5 17.2 16 17.7 18.3 15.2C19.8 13.5 19.4 10.8 17.2 9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M13 8.8C9.8 9.2 6.1 11.8 6.1 15C6.1 17.2 8.2 18.7 10.8 18.3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="8.2" cy="8.2" r="1.4" fill="currentColor" />
          <circle cx="17.3" cy="9" r="1.4" fill="currentColor" />
          <circle cx="10.8" cy="18.3" r="1.4" fill="currentColor" />
        </svg>
      );

    case 'RESTful APIs':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <path
            d="M7.5 5.5C6.2 5.5 5.5 6.3 5.5 7.6V10C5.5 11 4.7 11.7 3.8 12C4.7 12.3 5.5 13 5.5 14V16.4C5.5 17.7 6.2 18.5 7.5 18.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.5 5.5C17.8 5.5 18.5 6.3 18.5 7.6V10C18.5 11 19.3 11.7 20.2 12C19.3 12.3 18.5 13 18.5 14V16.4C18.5 17.7 17.8 18.5 16.5 18.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.8 7.5L10.2 16.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'IAM':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <path
            d="M12 3L4.5 6V11.5C4.5 16.2 7.7 20.1 12 21.5C16.3 20.1 19.5 16.2 19.5 11.5V6L12 3Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="10.2" r="2" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M8.8 16.2C9.4 14.7 10.6 13.8 12 13.8C13.4 13.8 14.6 14.7 15.2 16.2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'Git':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <rect
            x="4.5"
            y="4.5"
            width="15"
            height="15"
            rx="2.5"
            transform="rotate(45 12 12)"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M10.5 7.5L12 9V15"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M12 9.5L14.8 12.2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="12" cy="9.2" r="1.3" fill="currentColor" />
          <circle cx="12" cy="15.2" r="1.3" fill="currentColor" />
          <circle cx="15" cy="12.4" r="1.3" fill="currentColor" />
        </svg>
      );

    case 'Agile/Scrum':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <path
            d="M19.5 11.5C19.5 7.36 16.14 4 12 4C7.86 4 4.5 7.36 4.5 11.5C4.5 15.64 7.86 19 12 19H19.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M17.2 16.5L19.8 19L17.2 21.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 13V11M12 13V9.5M14.5 13V10.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={svgClass}>
          <path
            d="M8.5 8L4 12L8.5 16M15.5 8L20 12L15.5 16M13.5 6L10.5 18"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
};
