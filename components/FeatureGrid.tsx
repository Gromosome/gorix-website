import { BoxesIcon, GaugeIcon, LayersIcon, ShieldIcon, TerminalIcon } from "@/components/Icons";

const icons = {
  boxes: BoxesIcon,
  gauge: GaugeIcon,
  layers: LayersIcon,
  shield: ShieldIcon,
  terminal: TerminalIcon,
};

type FeatureGridProps = {
  features: { icon: keyof typeof icons; title: string; copy: string }[];
};

export function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <div className="feature-grid">
      {features.map(({ icon, title, copy }) => {
        const Icon = icons[icon];
        return (
        <article className="feature-card" key={title}>
          <span className="feature-icon"><Icon /></span>
          <h3>{title}</h3>
          <p>{copy}</p>
        </article>
        );
      })}
    </div>
  );
}
