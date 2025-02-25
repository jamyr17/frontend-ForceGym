import { CiWarning } from "react-icons/ci";

type NoDataProps = {
    module: string
}

function NoData({ module } : NoDataProps) {
    return (
        <div className="self-center flex flex-col text-center flex-center gap-2 my-8 m-4">
            <CiWarning className="text-red-500 text-8xl self-center"/>
            <span className="text-2xl">No hay {module} para mostrar</span>
            <span className="text-1xl font-bold">Intenta agregando</span>
        </div>
    );
}

export default NoData;