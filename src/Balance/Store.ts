import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface EconomicMovement {
  id: number;
  registrationDate: string;
  detail: string;
  amount: number;
  isDeleted: boolean;
  voucherNumber?: string;
  meanOfPayment?: number;
  clientId?: number;
  activityTypeId?: number;
  userId?: number;
  categoryId?: number;
}

interface EconomicFilters {
  filterByStatus?: string;
  filterByAmountRangeMin?: number;
  filterByAmountRangeMax?: number;
  filterByDateRangeStart?: string;
  filterByDateRangeEnd?: string;
  filterByMeanOfPayment?: number;
  filterByCategory?: number;
  filterByTypeClient?: number;
}

type EconomicStore = {
  incomes: EconomicMovement[];
  expenses: EconomicMovement[];
  modalForm: boolean;
  modalFilter: boolean;
  activeEditingId: number | null;
  filters: EconomicFilters;
  fetchIncomes: () => Promise<void>;
  fetchExpenses: () => Promise<void>;
  getMovementById: (
    id: number,
    type: "income" | "expense"
  ) => EconomicMovement | undefined;
  showModalForm: () => void;
  closeModalForm: () => void;
  showModalFilter: () => void;
  closeModalFilter: () => void;
  setFilter: (filter: Partial<EconomicFilters>) => void;
  resetFilters: () => void;
};

export const useEconomicStore = create<EconomicStore>()(
  devtools((set, get) => ({
    incomes: [],
    expenses: [],
    modalForm: false,
    modalFilter: false,
    activeEditingId: null,
    filters: {},

    fetchIncomes: async () => {
      const { filters } = get();
      const params = new URLSearchParams();
      const token = localStorage.getItem("auth_token");

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });

      const queryString = params.toString();
      const response = await fetch(
        `${import.meta.env.VITE_URL_API}economicIncome/listAll${
          queryString ? `?${queryString}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      set({ incomes: result.data });
    },

    fetchExpenses: async () => {
      const { filters } = get();
      const params = new URLSearchParams();
      const token = localStorage.getItem("auth_token");

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });

      const queryString = params.toString();
      const response = await fetch(
        `${import.meta.env.VITE_URL_API}economicExpense/listAll${
          queryString ? `?${queryString}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      set({ expenses: result.data });
    },

    getMovementById: (id, type) => {
      return type === "income"
        ? get().incomes.find((m) => m.id === id)
        : get().expenses.find((m) => m.id === id);
    },

    showModalForm: () => set({ modalForm: true }),
    closeModalForm: () => set({ modalForm: false, activeEditingId: null }),
    showModalFilter: () => set({ modalFilter: true }),
    closeModalFilter: () => set({ modalFilter: false }),

    setFilter: (filter) =>
      set((state) => ({
        filters: { ...state.filters, ...filter },
      })),

    resetFilters: () => set({ filters: {} }),
  }))
);
