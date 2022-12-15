import {atom} from 'recoil';

export interface ModalProperties {
	title: string,
	contents: JSX.Element
	size?: 'small' | 'middle' | 'large'
}

export interface ModalModel extends ModalProperties {
	show: boolean,
}

export const ModalDefault: ModalModel = {
	show: false,
	title: '',
	contents: <></>
}

export const ModalAtom = atom<ModalModel>({
	key: 'ModalAtom',
	default: ModalDefault
})
