import {useMediaQuery} from "react-responsive";
import {useEffect} from "react";
import {useSetRecoilState} from "recoil";
import {ResponsiveUIAtom} from "../recoil/responsive-ui.atom";
import {screenSizeConfig} from "../model/ui.model";

const ResponsiveUIHandler = () => {
    
    const config = screenSizeConfig;
    
    const isDesktop = useMediaQuery({ minWidth: config.desktopMin });
    const isTablet = useMediaQuery({ minWidth: config.tabletMin, maxWidth: config.tabletMax });
    const isMobile = useMediaQuery({ maxWidth: config.mobileMax });
    
    const setter = useSetRecoilState(ResponsiveUIAtom);
    
    useEffect(() => {
        setter({
            isDesktop: isDesktop,
            isTablet: isTablet,
            isMobile: isMobile
        });
    }, [isDesktop, isTablet, isMobile])
    
    return null;
}

export default ResponsiveUIHandler
