import {ActionType, BaseColorMax, CharactersModel, Color, ColorInfo} from "../../../model/coordination-simulator.model";
import {DraggableData, Rnd} from "react-rnd";
import {BLUE} from "../../../model/color.model";
import {DraggableEvent} from "react-draggable";
import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {EquipmentSubCategory} from "../../../model/equipment.model";
import {region, version} from "../../../model/maplestory-io.model";
import {getCharacter} from "../../../api/maplestory-io.api";
import {Spin} from "antd";
import {doFetch} from "../../../util/fetch.util";


const ImageWrapper = styled.div`
    position: absolute;
    cursor: move;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`

interface Props {
    character: CharactersModel
    isActiveCharacter: boolean
    doAction: (type: ActionType, ...args: any) => void
    setActiveCharacterIdx: () => void
}

interface ImgInfo {
    src: string
    width: number
    height: number
}

const Character = (props: Props) => {
    const character = props.character;
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [imgInfoList, setImgInfoList] = useState<ImgInfo[] | undefined>(undefined);
    
    const dragControl = (event: DraggableEvent, data: DraggableData, ...args: any) => {
        if (event.type === 'mousemove') {
            setIsDragging(true)
        }
        
        if (event.type === 'mouseup') {
            if (args && args.length > 0) {
                props.doAction('HANDLE_POSITION', {x: data.x, y: data.y, key: args[0]})
            }
            
            setTimeout(() => {
                setIsDragging(false);
            }, 100);
        }
    }
    
    const getCharacterSrc = (character: { key: EquipmentSubCategory, value: any }[], hairCustomMixColor?: Color) => {
        let arr = character.map((item: any) => (item.value.id))
        
        // 헤어 커믹 적용
        if (hairCustomMixColor) {
            // 기존 헤어 검색
            const hair = character.find(item => item.key === 'Hair');
            if (hair) {
                const hairId = hair.value.id
                // 기존 헤어 제거
                arr = arr.filter(id => id !== hairId);
                
                const hairWithoutColorId = hairId.toString().slice(0, -1);
                const mapleIoIdx = ColorInfo[hairCustomMixColor].ioIdx;
                
                arr.push(hairWithoutColorId + mapleIoIdx.toString())
            }
        }
        
        // 피부인 경우 '얼굴 피부' 만 대상이기 때문에 몸통에도 똑같이 적용한다.
        const head = character.find(item => item.key === 'Head')
        if (head) {
            arr.push(Number(head.value.id.toString().substring(1)))
        } else {
            // 머리
            arr.push(12000);
            // 몸통
            arr.push(2000);
        }
        
        arr = arr.map(id => ({itemId: id, region: region, version: version}));
        
        const str = encodeURIComponent(JSON.stringify(arr).slice(1, -1));
        
        return getCharacter(str)
    }
    
    useEffect(() => {
        setImgInfoList(undefined)
        
        const promiseArr = [];
        
        if (character.hairCustomMix !== undefined && character.hairCustomMix.baseColor !== undefined && character.hairCustomMix.mixColor !== undefined && character.hairCustomMix.baseColorRatio !== undefined) {
            promiseArr.push(doFetch(getCharacterSrc(character.data, character.hairCustomMix!.baseColor!), 'IMG'));
            promiseArr.push(doFetch(getCharacterSrc(character.data, character.hairCustomMix!.mixColor!), 'IMG'));
        } else {
            promiseArr.push(doFetch(getCharacterSrc(character.data), 'IMG'));
        }
        
        Promise.all(promiseArr)
            .then(res => {
                const img = new Image();
                img.src = res[0];
                img.onload = function () {
                    setImgInfoList(
                        res.map(src => ({src: src, width: img.width, height: img.height}))
                    )
                }
            })
        
    }, [
        getCharacterSrc(character.data, character.hairCustomMix?.baseColor),
        getCharacterSrc(character.data, character.hairCustomMix?.mixColor)
    ])
    
    return (
        <Rnd
            key={character.key}
            position={{
                x: character.x,
                y: character.y
            }}
            size={{
                width: character.width,
                height: character.height
            }}
            bounds={'parent'}
            enableResizing={{
                bottomRight: props.isActiveCharacter
            }}
            resizeHandleStyles={{
                bottomRight: {
                    width: '10px',
                    height: '10px',
                    borderRadius: '10px',
                    backgroundColor: BLUE
                }
            }}
            onResizeStop={(e, dir, ref) => props.doAction('HANDLE_RESIZE', character.key, {
                width: ref.offsetWidth,
                height: ref.offsetHeight
            })}
            onDrag={dragControl}
            onDragStop={(e, data) => dragControl(e, data, character.key)}
            maxWidth={imgInfoList === undefined ? 'auto' : imgInfoList[0].width * 2}
            minWidth={imgInfoList === undefined ? 'auto' : imgInfoList[0].width}
            maxHeight={imgInfoList === undefined ? 'auto' : imgInfoList[0].height * 2}
            minHeight={imgInfoList === undefined ? 'auto' : imgInfoList[0].height}
            style={{zIndex: 999}}
        >
            <ImageWrapper onClick={() => isDragging ? undefined : props.setActiveCharacterIdx()}>
                {
                    imgInfoList
                        ?
                        imgInfoList.map((img, idx) => (
                            <img key={idx}
                                 src={img.src}
                                 alt={'캐릭터'}
                                 style={{
                                     width: '100%',
                                     position: 'absolute',
                                     opacity: idx === 0 ? 1 : (BaseColorMax - character.hairCustomMix!.baseColorRatio!) / 100
                                 }}
                                 draggable={false}
                            />
                        ))
                        : <Spin size={'small'} tip={'Loading...'}/>
                }
            </ImageWrapper>
        </Rnd>
    
    )
}

export default Character
