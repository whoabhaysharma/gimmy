import React from 'react'

function Modal({ children, active = false }) {

    return (
        <dialog className="modal" open={active}>
            <div className="modal-box">
                {children}
            </div>
        </dialog>
    )
}

export default Modal