import {useRecoilState} from 'recoil';
import {ModalAtom, ModalDefault} from '../../../recoil/modal.atom';
import {Button, Modal as AntdModal} from 'antd';
import NoMarginHeading from './element/NoMarginHeading';

const Modal = () => {
	const [modal, setModal] = useRecoilState(ModalAtom);
	
	const closeModal = () => {
		setModal(ModalDefault);
	}
	
	const getWidth = () => {
		if (!modal.size) return undefined;
		
		switch (modal.size) {
			case 'small':
				return undefined;
			case 'middle':
				return '40%';
			case 'large':
				return '60%';
		}
	}
	
	return (
		<AntdModal
			width={getWidth()}
			title={<NoMarginHeading size={2}>{modal.title}</NoMarginHeading>}
			open={modal.show}
			onCancel={closeModal}
			footer={
				<Button type={'primary'} onClick={closeModal}>확인</Button>
			}
		>
			{modal.contents}
		</AntdModal>
	)
}

export default Modal
