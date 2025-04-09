import { create } from "zustand";

interface Category {
  idCategory: number;
  name: string;
  isDeleted: boolean;
}

interface CategoryStore {
  categories: Category[];
  modalForm: boolean;
  modalInfo: boolean;
  page: number;
  size: number;
  totalRecords: number;
  fetchCategories: () => Promise<{ logout: boolean }>;
  getCategoryById: (id: number) => void;
  changePage: (newPage: number) => void;
  changeSize: (newSize: number) => void;
  showModalForm: () => void;
  showModalInfo: () => void;
  closeModalForm: () => void;
  closeModalInfo: () => void;
}

const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [
    {
      idCategory: 1,
      name: "categorias ejemplos",
      isDeleted: false,
    },
    {
      idCategory: 2,
      name: "categorias ejemplos",
      isDeleted: true,
    },
  ],
  modalForm: false,
  modalInfo: false,
  page: 1,
  size: 5,
  totalRecords: 2,

  fetchCategories: async () => {
    return { logout: false }; // Simula la autenticación
  },

  getCategoryById: (id) => {
    console.log("Obtener categoría con ID:", id);
  },

  changePage: (newPage) => set({ page: newPage }),
  changeSize: (newSize) => set({ size: newSize }),
  showModalForm: () => set({ modalForm: true }),
  showModalInfo: () => set({ modalInfo: true }),
  closeModalForm: () => set({ modalForm: false }),
  closeModalInfo: () => set({ modalInfo: false }),
}));

export default useCategoryStore;
