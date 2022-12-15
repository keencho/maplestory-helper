import {useRecoilState} from 'recoil';
import {ModalAtom, ModalDefault, ModalProperties} from '../recoil/modal.atom';

const useModal = () => {
	const [modal, setModal] = useRecoilState(ModalAtom);
	
	const showModal = (properties: ModalProperties) => {
		setModal({
			show: true,
			title: properties.title,
			contents: properties.contents,
			size: properties.size
		})
	}
	
	const closeModal = () => {
		setModal(ModalDefault);
	}
	
	return [showModal, closeModal]
}

export default useModal
