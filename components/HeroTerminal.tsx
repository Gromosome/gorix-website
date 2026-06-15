type HeroTerminalProps = {
  title: string;
  ariaLabel: string;
  code: string;
  status: string;
};

export function HeroTerminal({ title, ariaLabel, code, status }: HeroTerminalProps) {
  return (
    <div className="terminal-card" aria-label={ariaLabel}>
      <div className="terminal-toolbar">
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-title">{title}</span>
      </div>
      <pre><code>{code}</code></pre>
      <div className="terminal-status">
        <span className="status-pulse" />
        <span>{status}</span>
      </div>
    </div>
  );
}
