import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getData} from "../shared/services/gym";

interface EconomicMovement {
  id: number;
  registrationDate: string;
  detail: string;
  amount: number;
  isDeleted: boolean;
  // Campos específicos
  voucherNumber?: string;
  meanOfPayment?: number;
  // Para ingresos
  clientId?: number;
  activityTypeId?: number;
  // Para gastos
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
  // Filtros específicos
  filterByCategory?: number; // Para gastos
  filterByTypeClient?: number; // Para ingresos
}

type EconomicStore = {
  // Datos
  incomes: EconomicMovement[];
  expenses: EconomicMovement[];
  
  // Estados de UI
  modalForm: boolean;
  modalFilter: boolean;
  activeEditingId: number | null;
  
  // Filtros
  filters: EconomicFilters;
  
  // Métodos para datos
  fetchIncomes: () => Promise<void>;
  fetchExpenses: () => Promise<void>;
  getMovementById: (id: number, type: 'income' | 'expense') => EconomicMovement | undefined;
  addMovement: (data: EconomicMovement, type: 'income' | 'expense') => Promise<void>;
  updateMovement: (data: EconomicMovement, type: 'income' | 'expense') => Promise<void>;
  deleteMovement: (id: number, type: 'income' | 'expense') => Promise<void>;
  
  // Métodos para UI
  showModalForm: () => void;
  closeModalForm: () => void;
  showModalFilter: () => void;
  closeModalFilter: () => void;
  
  // Métodos para filtros
  setFilter: (filter: Partial<EconomicFilters>) => void;
  resetFilters: () => void;
};

export const useEconomicStore = create<EconomicStore>()(
  devtools((set, get) => ({
    // Estado inicial
    incomes: [],
    expenses: [],
    modalForm: false,
    modalFilter: false,
    activeEditingId: null,
    filters: {},
    
    // Métodos para obtener datos
    fetchIncomes: async () => {
      const { filters } = get();
      const params = new URLSearchParams();
      
      // Aplicar filtros
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
      const queryString = params.toString();
      const result = await getData(
        `${import.meta.env.VITE_URL_API}economicIncome/listAll${queryString ? `?${queryString}` : ''}`
      );
      set({ incomes: result.data });
    },
    
    fetchExpenses: async () => {
      const { filters } = get();
      const params = new URLSearchParams();
      
      // Aplicar filtros
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
      const queryString = params.toString();
      const result = await getData(
      `${import.meta.env.VITE_URL_API}economic/listAll${queryString ? `?${queryString}` : ''}`
      );
      set({ expenses: result.data });
    },
    
    getMovementById: (id, type) => {
      return type === 'income' 
        ? get().incomes.find(m => m.id === id)
        : get().expenses.find(m => m.id === id);
    },
    
    // Métodos para UI
    showModalForm: () => set({ modalForm: true }),
    closeModalForm: () => set({ modalForm: false, activeEditingId: null }),
    showModalFilter: () => set({ modalFilter: true }),
    closeModalFilter: () => set({ modalFilter: false }),
    
    // Métodos para filtros
    setFilter: (filter) => set(state => ({ 
      filters: { ...state.filters, ...filter } 
    })),
    
    resetFilters: () => set({ filters: {} })
  }))
);