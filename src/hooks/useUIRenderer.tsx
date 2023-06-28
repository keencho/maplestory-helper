import * as React from "react";
import {useRecoilValue} from "recoil";
import {ResponsiveUIAtom} from "../recoil/responsive-ui.atom";

const useUIRenderer = () => {
    
    const ui = useRecoilValue(ResponsiveUIAtom);

    return (options: { desktop?: React.ReactNode, mobile?: React.ReactNode }): React.ReactNode => {
        if (ui?.isDesktop) {
            return options.desktop;
        } else {
            return options.mobile;
        }
    };
}

export default useUIRenderer
