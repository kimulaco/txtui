/// <reference types="astro/client" />

declare module "*.astro" {
  const AstroComponent: (props: Record<string, unknown>) => any;
  export default AstroComponent;
}
