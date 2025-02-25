import { formatAmountToCRC } from "../shared/utils/format";
import useProductInventoryStore from "./Store";

function DataInfo() {
    const { productsInventory, activeEditingId } = useProductInventoryStore()
    if (!activeEditingId) return <></>;

    const productInventory = productsInventory.find(productsInventory => productsInventory.idProductInventory === activeEditingId)
    if (!productInventory) return <></>

    return (
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Producto</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>CÓDIGO</strong></p>
                    <p>{productInventory.code}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>NOMBRE</strong></p>
                    <p>{productInventory.name}</p>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">DETALLES</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>CANTIDAD</strong></p>
                    <p>{productInventory.quantity}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>COSTO</strong></p>
                    <p>{productInventory.cost}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>PRECIO UNITARIO</strong></p>
                    <p>{formatAmountToCRC(productInventory.cost)}</p>
                </div>
            </div>
        </div>
    );
}

export default DataInfo;
