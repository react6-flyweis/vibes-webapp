// In src/global.d.ts or another .d.ts file

import "react";

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

// Allow importing SVGs as URL strings (used with <img src={...} />)
declare module "*.svg" {
  const src: string;
  export default src;
}
