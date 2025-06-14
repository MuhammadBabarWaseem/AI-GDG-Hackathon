import type { SVGProps } from 'react';

const LogoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 9l6-6 6 6" />
    <path d="M12 3v10" />
    <path d="M6 15H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2" />
    <circle cx="9" cy="18" r="1" />
    <circle cx="15" cy="18" r="1" />
    <path d="M9 18h6" />
  </svg>
);

export default LogoIcon;
