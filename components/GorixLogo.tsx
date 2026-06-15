import Image from "next/image";
import { cdnUrl, content } from "@/lib/content";

type GorixLogoProps = {
  size?: number;
  withText?: boolean;
  priority?: boolean;
};

export function GorixLogo({ size = 42, withText = true, priority = false }: GorixLogoProps) {
  return (
    <span className="brand-lockup">
      <span className="brand-mark" style={{ width: size, height: size }}>
        <Image src={cdnUrl(content.site.logo.src)} alt={content.site.logo.alt} fill sizes={`${size}px`} priority={priority} />
      </span>
      {withText && <span className="brand-name">GORIX</span>}
    </span>
  );
}
