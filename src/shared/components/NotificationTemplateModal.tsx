import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoIosClose } from "react-icons/io";
import useNotificationTemplateStore from "../../TemplateNotification/Store";
import { NotificationTemplate, Client } from "../types";

const gymColors = {
  primary: "#cfad04",
  secondary: "#000000",
  accent: "#FFFFFF",
  error: "#E53E3E"
};

interface NotificationTemplateModalProps {
  clients: Client[];
  onSend: (templateId: number, message: string, clientId: number) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationTemplateModal({ clients, onSend, isOpen, onClose }: NotificationTemplateModalProps) {
  const { notificationTemplates, fetchNotificationTemplates } = useNotificationTemplateStore();
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<number | "">("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotificationTemplates();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && clients.length > 0) {
      setSelectedClientId(clients[0].idClient);
    }
  }, [isOpen, clients]);

  const handleTemplateChange = (templateId: string) => {
    const template = notificationTemplates.find(t => t.idNotificationTemplate === Number(templateId)) || null;
    console.log("Plantilla seleccionada:", template);
    setSelectedTemplate(template);
    setMessage(template?.message || "");
  };

  const handleSend = async () => {
    if (!selectedTemplate) {
      setError("Debes seleccionar una plantilla");
      return;
    }
    if (!message.trim()) {
      setError("El mensaje no puede estar vacío");
      return;
    }

    setIsSending(true);
    try {
      await onSend(selectedTemplate.idNotificationTemplate, message, Number(selectedClientId));
      setError(null);
      onClose();
    } catch (err) {
      setError("Error al enviar la notificación");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md rounded-lg shadow-xl overflow-hidden" style={{ backgroundColor: gymColors.accent }}>
              <div className="p-4 flex justify-between items-center" style={{ backgroundColor: gymColors.primary }}>
                <Dialog.Title className="text-xl font-bold" style={{ color: gymColors.secondary }}>ENVIAR NOTIFICACIÓN</Dialog.Title>
                <button onClick={onClose} className="text-2xl hover:bg-black/10 p-1 rounded-full" style={{ color: gymColors.secondary }}>
                  <IoIosClose />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {error && (
                  <div className="p-3 rounded text-sm flex items-center" style={{ backgroundColor: "#FEE2E2", color: gymColors.error }}>
                    <span className="flex-grow">{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-bold uppercase tracking-wider" style={{ color: gymColors.secondary }}>CLIENTE</label>
                  <select
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: gymColors.primary }}
                    onChange={(e) => setSelectedClientId(Number(e.target.value))}
                    value={selectedClientId}
                  >
                    {clients.map(client => (
                      <option key={client.idClient} value={client.idClient}>
                        {client.name} {client.firstLastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold uppercase tracking-wider" style={{ color: gymColors.secondary }}>PLANTILLA</label>
                  <select
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: gymColors.primary }}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    value={selectedTemplate?.idNotificationTemplate || ""}
                  >
                    <option value="">Selecciona una plantilla</option>
                    {notificationTemplates.map(template => (
                      <option key={template.idNotificationTemplate} value={template.idNotificationTemplate}>
                        {template.message}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold uppercase tracking-wider" style={{ color: gymColors.secondary }}>MENSAJE</label>
                  <textarea
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: gymColors.primary, minHeight: "100px", resize: "none" }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="El mensaje de la plantilla aparecerá aquí al seleccionarla"
                  />
                </div>

                <button
                  className={`w-full py-3 rounded-lg font-bold transition-colors mt-6 ${isSending ? 'opacity-80' : 'hover:bg-opacity-90'}`}
                  style={{ backgroundColor: gymColors.primary, color: gymColors.secondary }}
                  onClick={handleSend}
                  disabled={isSending}
                >
                  {isSending ? "ENVIANDO..." : "ENVIAR NOTIFICACIÓN"}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
