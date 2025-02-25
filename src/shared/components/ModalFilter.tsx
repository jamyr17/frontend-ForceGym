import { Fragment } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'

type FilterModalProps = {
    modalFilter: boolean
    closeModalFilter: () => void
    FilterButton: () => JSX.Element
    FilterSelect: () => JSX.Element
}

function ModalFilter({ modalFilter, closeModalFilter, FilterButton, FilterSelect } : FilterModalProps) {

    return (
        <>
            <FilterButton/>

            <Transition appear show={modalFilter} as={Fragment}>
                <Dialog as="div" className="relative z-1" onClose={() => { 
                        closeModalFilter() 
                    }}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 backdrop-brightness-50" />
                    </TransitionChild>

                    <div className="fixed inset-0">
                        <div className="flex min-h-full items-start justify-end p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel 
                                    className="flex flex-col w-auto max-w-3xl transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                                >
                                    
                                    <FilterSelect/>

                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}

export default ModalFilter;