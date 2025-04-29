import { formatAmountToCRC } from "../shared/utils/format";
import useAssetStore from "./Store";

function DataInfo() {
    const { assets, activeEditingId } = useAssetStore()
    if (!activeEditingId) return <></>;

    const asset = assets.find(assets => assets.idAsset === activeEditingId)
    if (!asset) return <></>

    const yearsSincePurchase = new Date().getFullYear() - new Date(asset.boughtDate).getFullYear();
    const currentValue = asset.initialCost - (asset.deprecationPerYear * yearsSincePurchase);
    const totalValue = currentValue * asset.quantity;

    return (
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Activo</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>CÓDIGO</strong></p>
                    <p>{asset.code}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>NOMBRE</strong></p>
                    <p>{asset.name}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>VIDA ÚTIL</strong></p>
                    <p>{asset.serviceLifeYears} años</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>DEPRECIACIÓN ANUAL POR UNIDAD</strong></p>
                    <p>{formatAmountToCRC(asset.deprecationPerYear)}</p>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">DETALLES</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>CANTIDAD</strong></p>
                    <p>{asset.quantity}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>PRECIO UNITARIO</strong></p>
                    <p>{formatAmountToCRC(asset.initialCost)}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>VALOR ACTUAL POR UNIDAD </strong></p>
                    <p>{formatAmountToCRC(currentValue)}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>VALOR ACTUAL EN TOTAL</strong></p>
                    <p>{formatAmountToCRC(totalValue)}</p>
                </div>
            </div>
        </div>
    );
}

export default DataInfo;
