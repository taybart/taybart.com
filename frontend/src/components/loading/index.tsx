import React, {FC} from 'react'

interface Props {
  size?: number;
  style?: React.CSSProperties;
  className?: string;
}

const inner = `absolute w-20 h-20 rounded-full border-dark dark:border-white`

const Loading: FC<Props> = (props: Props) => {
  const {size = 64, style: styles = {}} = props

  return (
    <div
      className={`radius ${props.className}`}
      style={{width: size, height: size, ...styles}}
    >
      <div className={`${inner} l-0 t-0 border-b-4 animate-loadingone`} />
      <div className={`${inner} r-0 t-0 border-r-4 animate-loadingtwo`} />
      <div className={`${inner} r-0 b-0 border-t-4 animate-loadingthree`} />
    </div>
  )
}

export default Loading
