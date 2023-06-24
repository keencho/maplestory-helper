import {Typography} from "antd";
import {ReactNode} from "react";

const { Text, Link } = Typography;

interface Props {
    children: ReactNode
    className?: string
    wrapper?: ReactNode
}

const CommonText = (props: Props) => {
    return <Text className={props.className}>{props.children}</Text>
}

export default CommonText
