import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { NotificationTemplateModal } from "./NotificationTemplateModal";

type Client = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  additionalInfo?: string;
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
  const [notificationType, setNotificationType] = useState<"mensualidades" | "cumpleanos" | "aniversarios">("mensualidades");

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const sendEmail = async (clients: Client[], subject: string, message: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

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
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error completo en sendEmail:", error);
      throw error;
    } finally {
      clearTimeout(timeoutId);
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

      if (!aniversariosRes.ok || !cumpleanosRes.ok || !vencimientosRes.ok) {
        throw new Error("Error al cargar los datos");
      }

      const [aniversariosData, cumpleanosData, vencimientosData] = await Promise.all([
        aniversariosRes.json(),
        cumpleanosRes.json(),
        vencimientosRes.json(),
      ]);

      setNotifications({
        aniversarios: aniversariosData?.data?.clients || [],
        cumpleanos: cumpleanosData?.data?.clients || [],
        mensualidades: vencimientosData?.data?.clients || [],
      });
    } catch (err) {
      setError("Error al cargar las notificaciones");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (type: "mensualidades" | "cumpleanos" | "aniversarios", clients: Client[]) => {
    setSelectedClients(clients);
    setNotificationType(type);
    setTemplateModalOpen(true);
  };

  const handleSendNotification = async (
    templateId: number,
    message: string,
    client: Client
  ) => {
    try {
      console.log("Enviando notificación a:", client.email);
      
      if (client.email) {
        await sendEmail([client], "Notificación de ForceGym", message);
      } else {
        console.warn(`Cliente ${client.name} no tiene email`);
      }
    
      if (client.phoneNumber) {
        const encodedMessage = encodeURIComponent(message);
        const phone = client.phoneNumber.startsWith("506")
          ? client.phoneNumber
          : `506${client.phoneNumber}`;
        const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
        window.open(whatsappUrl, "_blank");
      } else {
        console.warn(`Cliente ${client.name} no tiene teléfono`);
      }
    } catch (error) {
      console.error("Error en handleSendNotification:", error);
    }
  };

  const renderNotificationSection = (
    title: string,
    type: "mensualidades" | "cumpleanos" | "aniversarios",
    clients: Client[],
    actionText: string
  ) => {
    if (clients.length === 0) return null;

    const mainClient = clients[0];
    const additionalCount = clients.length - 1;

    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-1">{title}</h2>
        <p className="mb-1">
          {additionalCount > 0
            ? `${mainClient.name} y ${additionalCount} persona${additionalCount !== 1 ? "s" : ""} más`
            : mainClient.name}
          {title === "Mensualidades"
            ? " se les ha caducado la mensualidad."
            : title === "Cumpleaños"
            ? " cumplen años el día de hoy."
            : " cumplen su aniversario el día de hoy."}
        </p>
        <button
          className="font-bold text-white hover:underline cursor-pointer"
          onClick={() => handleActionClick(type, clients)}
        >
          {actionText}
        </button>
      </div>
    );
  };

  const hasNotifications = () => {
    return (
      notifications.mensualidades.length > 0 ||
      notifications.cumpleanos.length > 0 ||
      notifications.aniversarios.length > 0
    );
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
                  ) : !hasNotifications() ? (
                    <p className="text-center py-4">No hay notificaciones</p>
                  ) : (
                    <>
                      {renderNotificationSection(
                        "Mensualidades",
                        "mensualidades",
                        notifications.mensualidades,
                        "Recuérdales"
                      )}
                      {renderNotificationSection(
                        "Cumpleaños",
                        "cumpleanos",
                        notifications.cumpleanos,
                        "Felicítales"
                      )}
                      {renderNotificationSection(
                        "Aniversarios",
                        "aniversarios",
                        notifications.aniversarios,
                        "Agradéceles"
                      )}
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
        notificationType={notificationType}
        onSend={handleSendNotification}
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
      />
    </>
  );
}