import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { NotificationTemplateModal } from "./NotificationTemplateModal";

type Client = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
};

type NotificationsData = {
  mensualidades: Client[];
  cumpleanos: Client[];
  aniversarios: Client[];
};

type NotificationsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<NotificationsData>({
    mensualidades: [],
    cumpleanos: [],
    aniversarios: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [notificationType, setNotificationType] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const getNotifiedClients = () => {
    return JSON.parse(localStorage.getItem("notifiedClients") || "[]");
  };

  const addNotifiedClients = (clientIds: string[]) => {
    const notifiedClients = new Set([...getNotifiedClients(), ...clientIds]);
    localStorage.setItem("notifiedClients", JSON.stringify([...notifiedClients]));
  };

  useEffect(() => {
    if (isOpen) {
      const allClients = [
        ...notifications.mensualidades,
        ...notifications.cumpleanos,
        ...notifications.aniversarios,
      ];
      const notifiedClients = getNotifiedClients();
      const clientsToNotify = allClients.filter(client => !notifiedClients.includes(client.id));

      if (clientsToNotify.length > 0) {
        sendEmail(clientsToNotify, "Notificación de ForceGym", "Mensaje automático de recordatorio.");
        addNotifiedClients(clientsToNotify.map(client => client.id));
      }
    }
  }, [isOpen, notifications]);

  const sendEmail = async (clients: Client[], subject: string, message: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${import.meta.env.VITE_URL_API}mail/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          toUsers: clients.map(client => client.email),
          subject,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el correo");
      }
      console.log("Correo enviado con éxito");
    } catch (error) {
      console.error("Error al enviar el correo:", error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("auth_token");

      const [aniversariosRes, cumpleanosRes, vencimientosRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_URL_API}client/filter?filterType=1`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_URL_API}client/filter?filterType=2`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_URL_API}client/filter?filterType=3`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [aniversariosData, cumpleanosData, vencimientosData] = await Promise.all([
        aniversariosRes.json(),
        cumpleanosRes.json(),
        vencimientosRes.json(),
      ]);

      const alreadyEmailed = JSON.parse(localStorage.getItem("alreadyEmailed") || "[]");

      const filterNewClients = (clients: Client[]) =>
        clients.filter((c) => !alreadyEmailed.includes(c.id));

      setNotifications({
        aniversarios: filterNewClients(aniversariosData?.data?.clients || []),
        cumpleanos: filterNewClients(cumpleanosData?.data?.clients || []),
        mensualidades: filterNewClients(vencimientosData?.data?.clients || []),
      });
    } catch (err) {
      setError("Error al cargar las notificaciones");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendWhatsApp = (client: Client, message: string) => {
    if (client.phoneNumber) {
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${client.phoneNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, "_blank");

      setSelectedClients(prevClients => prevClients.filter(c => c.id !== client.id));
    } else {
      console.error(`El cliente ${client.name} no tiene un número de teléfono registrado.`);
    }
  };

  const handleActionClick = (type: string, clients: Client[]) => {
    setSelectedClients(clients);
    setNotificationType(type);
    setTemplateModalOpen(true);
  };

  const handleSendNotification = async (templateId: number, message: string, clientId: number) => {
    try {
      const token = localStorage.getItem("auth_token");
      await fetch(`${import.meta.env.VITE_URL_API}notification/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idNotificationTemplate: templateId,
          message,
          idClient: clientId,
        }),
      });
      console.log("Notificación enviada con éxito");
    } catch (err) {
      console.error("Error al enviar notificación:", err);
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/65" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-start justify-end p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-96 bg-[#E6C200] text-black rounded-lg shadow-xl overflow-hidden">
                <div className="bg-black text-white p-4 flex items-center gap-2 font-bold text-lg">
                  <IoIosNotificationsOutline className="text-2xl" /> Notificaciones
                </div>
                <div className="p-4">
                  {loading ? (
                    <p>Cargando notificaciones...</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : (
                    <>
                      <h3 className="text-lg font-bold mb-2">Mensualidades</h3>
                      {notifications.mensualidades.map(client => (
                        <div key={client.id} className="mb-4 flex justify-between items-center">
                          <p>{client.name}</p>
                          <button
                            className="bg-black text-white px-2 py-1 rounded"
                            onClick={() => handleActionClick("mensualidades", [client])}
                          >
                            Usar plantilla
                          </button>
                        </div>
                      ))}

                      <h3 className="text-lg font-bold mt-6 mb-2">Cumpleaños</h3>
                      {notifications.cumpleanos.map(client => (
                        <div key={client.id} className="mb-4 flex justify-between items-center">
                          <p>{client.name}</p>
                          <button
                            className="bg-black text-white px-2 py-1 rounded"
                            onClick={() => handleActionClick("cumpleanos", [client])}
                          >
                            Usar plantilla
                          </button>
                        </div>
                      ))}

                      <h3 className="text-lg font-bold mt-6 mb-2">Aniversarios</h3>
                      {notifications.aniversarios.map(client => (
                        <div key={client.id} className="mb-4 flex justify-between items-center">
                          <p>{client.name}</p>
                          <button
                            className="bg-black text-white px-2 py-1 rounded"
                            onClick={() => handleActionClick("aniversarios", [client])}
                          >
                            Usar plantilla
                          </button>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <NotificationTemplateModal
        clients={selectedClients}
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        onSend={handleSendNotification}
      />
    </>
  );
}
