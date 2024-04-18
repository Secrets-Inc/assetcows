import React from "react";
import { ColorTheme, CopyrightStyles, Locales } from "../index";
export type SymbolInfoProps = {
    symbol?: string;
    width?: string | number;
    autosize?: boolean;
    locale?: Locales;
    colorTheme?: ColorTheme;
    isTransparent?: boolean;
    largeChartUrl?: string;
    children?: never;
    copyrightStyles?: CopyrightStyles;
};
declare const _default: React.NamedExoticComponent<SymbolInfoProps>;
export default _default;
