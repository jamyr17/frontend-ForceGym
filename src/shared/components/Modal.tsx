import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import { MdOutlineCancel } from "react-icons/md";

type ModalProps = {
    Button: () => JSX.Element
    modal: boolean
    closeModal: () => void
    getDataById: (id : number) => void
    Content: () => JSX.Element
}

function Modal({ Button, modal, getDataById, closeModal, Content } : ModalProps) {
    
    return (
        <>
            <Button/>
            <Transition appear show={modal} as={Fragment}>
                <Dialog as="div" className="relative z-1" onClose={() => { getDataById(0); closeModal() }}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out "
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in "
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0" 
                    >
                        <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-75" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out "
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in "
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="flex flex-col w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl ">
                                    <button className='flex justify-end text-4xl pr-4' onClick={() => { getDataById(0); closeModal() }}>
                                        <MdOutlineCancel className='hover:cursor-pointer hover:text-yellow'/>
                                    </button>
                                    <Content/>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}

export default Modal;