import {useMediaQuery} from "react-responsive";
import {useEffect} from "react";
import {useSetRecoilState} from "recoil";
import {ResponsiveUIAtom} from "../recoil/responsive-ui.atom";

const ResponsiveUIHandler = () => {
    
    const isDesktop = useMediaQuery({ minWidth: 992 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
    const isMobile = useMediaQuery({ maxWidth: 767 });
    
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
