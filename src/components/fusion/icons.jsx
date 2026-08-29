export const STREAM_ICONS = {
  imaging: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.5 9h17M9 3.5v17" stroke="currentColor" strokeWidth="1" opacity=".55" />
      <circle cx="14.5" cy="14" r="2.6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  clinical: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path
        d="M6 3.5h9l3.5 3.5V20a.5.5 0 01-.5.5H6a.5.5 0 01-.5-.5V4a.5.5 0 01.5-.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 12h7M8.5 15.2h7M8.5 8.8h4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity=".7"
      />
    </svg>
  ),
  vitals: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path
        d="M3 12.5h3.2l1.6-4 2.6 8 2.2-6.4 1.4 2.4H21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};
