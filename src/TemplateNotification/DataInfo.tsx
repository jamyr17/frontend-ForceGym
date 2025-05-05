import useNotificationTemplateStore from "./Store";

function DataInfo() {
    const { notificationTemplates, activeEditingId } = useNotificationTemplateStore();
    if (!activeEditingId) return <></>;

    const template = notificationTemplates.find(template => template.idNotificationTemplate === activeEditingId);
    if (!template) return <></>;

    return (
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Plantilla</h1>
                
                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>Mensaje</strong></p>
                    <p>{template.message}</p>
                </div>
            </div>
            
            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Detalles</h1>
                
                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>Tipo de Notificación</strong></p>
                    <p>{template.notificationType.name}</p>
                </div>
                
            </div>
        </div>
    );
}

export default DataInfo;
