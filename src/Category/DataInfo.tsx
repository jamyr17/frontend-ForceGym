import useCategoryStore from "./Store";

function DataInfo() {
    const { categories, activeEditingId } = useCategoryStore();
    if (!activeEditingId) return <></>;

    const category = categories.find(cat => cat.idCategory === activeEditingId);
    if (!category) return <></>;

    return (
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Categoría</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>Nombre</strong></p>
                    <p>{category.name}</p>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Detalles</h1>

            </div>
        </div>
    );
}

export default DataInfo;
