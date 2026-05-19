import { ComponentType, SVGProps } from "react";

export type HeroIcon = ComponentType<SVGProps<SVGSVGElement>>;

export interface NavPage {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavModule {
  label: string;
  icon: HeroIcon;
  pages: NavPage[];
  expanded?: boolean;
}
