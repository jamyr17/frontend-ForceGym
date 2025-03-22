import { useState } from "react"

type FileTypeDecisionProps = {
    closeModal: () => void
    modulo: string
}

function FileTypeDecision ({ modulo, closeModal } : FileTypeDecisionProps) {
    const [filePDF, setFilePDF] = useState(false)
    const [fileExcel, setFileExcel] = useState(false)

    const handleClickOptionPDF = () => {
        setFilePDF(!filePDF)

        if(fileExcel){
            setFileExcel(false)
        }
    }

    const handleClickOptionExcel = () => {
        setFileExcel(!fileExcel)

        if(filePDF){
            setFilePDF(false)
        }
    }

    return (
        <div className="justify-center">
            <header className="mb-12">
                <h1 className="text-xl pb-2 font-bold">{modulo}</h1>
                <p>Elija el tipo de archivo al que desea exportar la información.</p>
            </header>
            
            <main className="grid grid-cols-2">
                <div 
                    className={`rounded-lg py-4 flex gap-4 justify-center items-center 
                        ${filePDF && 'outline outline-blue-900'} 
                        hover:outline outline-blue-900 cursor-pointer`}
                    onClick={handleClickOptionPDF}
                >
                    
                    <img src="/logo-pdf.webp" alt="Logo de PDF" className="w-12 h-auto" />
                    Documento PDF
                </div>

                <div 
                    className={`rounded-lg py-4 flex gap-4 justify-center items-center 
                        ${fileExcel && 'outline outline-blue-900'}  
                        hover:outline outline-blue-900 cursor-pointer`}
                    onClick={handleClickOptionExcel}        
                >
                    <img src="/logo-excel.webp" alt="Logo de Excel" className="w-12 h-auto"></img>
                    Documento Excel
                </div>
            </main>
            
            <div className="mt-12 mb-2 flex gap-24 w-full justify-center">
                <button 
                    className="rounded-lg px-6 py-2 border-2 border-gray-400 hover:opacity-75 cursor-pointer"
                    onClick={closeModal}
                > 
                    Cancelar 
                </button>
                <button className="rounded-lg px-6 py-2 bg-yellow hover:opacity-75 cursor-pointer"> 
                    Confirmar 
                </button>
            </div>
        </div>
    )
}

export default FileTypeDecision;