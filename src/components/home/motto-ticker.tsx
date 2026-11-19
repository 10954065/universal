/**
 * Gold band under the hero with the motto scrolling endlessly across it.
 * The second copy of the words exists only to close the loop, so it is hidden from screen readers.
 * The scroll pauses on hover and stops entirely for people who prefer reduced motion.
 */
export function MottoTicker({ items }: { items: string[] }) {
  const words = items.filter(Boolean);
  if (words.length === 0) return null;
  // A short list is repeated so one run is always wider than the screen.
  const loop = words.length < 6 ? [...words, ...words] : words;

  const run = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {loop.map((word, index) => (
        <li key={`${word}-${index}`} aria-hidden={(!hidden && index >= words.length) || undefined} className="flex items-center whitespace-nowrap">
          <span className="px-6 font-display text-[1.375rem] font-extrabold uppercase tracking-[-0.01em] sm:text-[1.75rem]">{word}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-flame sm:h-6 sm:w-6">
            <path d="M12 0 14.6 9.4 24 12 14.6 14.6 12 24 9.4 14.6 0 12 9.4 9.4Z" fill="currentColor" />
          </svg>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee overflow-hidden border-y-2 border-navy-900 bg-gold py-4 text-navy-900">
      <div className="marquee-track flex w-max">
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}
