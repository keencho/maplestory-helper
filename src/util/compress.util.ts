import * as pako from 'pako';

const base64ArrayBuffer = (arrayBuffer: ArrayBuffer): string => {
	let binary = '';
	const bytes = new Uint8Array(arrayBuffer);
	const len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
}

export const compress = (str: string): string => {
	const compressedData = pako.gzip(str);
	const binaryData = new Uint8Array(compressedData);
	
	return base64ArrayBuffer(binaryData.buffer)
}

export const deCompress = (str: string) => {
	const binaryData = new Uint8Array(window.atob(str).split('').map(char => char.charCodeAt(0)));
	return pako.ungzip(binaryData, { to: 'string' });
}
