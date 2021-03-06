import React, {FC} from 'react'

interface Props {
  className?: string;
  onClick?: () => void;
}
const EditIcon: FC<Props> = ({className, onClick}) => {
  return (<div className={className} onClick={onClick}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  </div>)
}

export default EditIcon
