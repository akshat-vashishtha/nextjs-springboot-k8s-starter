import React from "react";

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function Modal(props: ModalProps) {
    const isOpen = props.isOpen;
    const onClose = props.onClose;
    const title = props.title;
    const children = props.children;

    if (!isOpen) {
        return null;
    }

    const modalElement = (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    <button className="modal-close-btn" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );

    return modalElement;
}
