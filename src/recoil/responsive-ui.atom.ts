import {atom} from "recoil";

export interface ResponsiveUIModel {
    isDesktop: boolean
    isTablet: boolean
    isMobile: boolean
}

export const ResponsiveUIAtom = atom<ResponsiveUIModel | undefined>({
    key: 'ResponsiveUIAtom',
    default: undefined
})
