import { create } from "zustand";
import { devtools } from "zustand/middleware";

type NotificationTemplateStore = {

}

export const useNotificationTemplateStore = create<NotificationTemplateStore>()(
    devtools((set) => ({

    })
))

export default useNotificationTemplateStore;