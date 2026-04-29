import type { Expense, Trip } from "../types/trip";

/**
 * Demo trip data that appears for all users.
 * This data is hardcoded and cannot be modified or deleted.
 */
export const DEMO_TRIP: Trip = {
  id: "demo-trip-001",
  name: "🎉 Chuyến đi mẫu - Đà Lạt",
  category: "Du lịch",
  creator: "demo-user",
  creatorName: "Tforart Tripsy Demo",
  creatorPhoto: "",
  participants: [
    {
      id: "demo-user-1",
      userId: "demo-user-1",
      name: "An",
      photoURL: "",
      totalSpent: 1200000,
    },
    {
      id: "demo-user-2",
      userId: "demo-user-2",
      name: "Bình",
      photoURL: "",
      totalSpent: 1000000,
    },
    {
      id: "demo-user-3",
      userId: "demo-user-3",
      name: "Châu",
      photoURL: "",
      totalSpent: 500000,
    },
    {
      id: "demo-user-4",
      userId: "demo-user-4",
      name: "Dũng",
      photoURL: "",
      totalSpent: 300000,
    },
  ],
  totalExpense: 3000000,
  startDate: new Date("2025-12-20"),
  endDate: new Date("2025-12-22"),
  isEnded: true,
  notes:
    "🌟 Đây là chuyến đi mẫu để bạn xem cách ứng dụng hoạt động!\n\n" +
    "• Bấm vào từng thành viên để xem chi tiết các khoản chi\n" +
    "• Xem phần 'Tổng kết' để biết ai cần trả tiền cho ai\n" +
    "• Tạo chuyến đi mới để bắt đầu sử dụng!",
  createdAt: new Date("2025-12-15"),
  updatedAt: new Date("2025-12-22"),
};

export const DEMO_EXPENSES: Expense[] = [
  {
    id: "demo-expense-1",
    tripId: "demo-trip-001",
    amount: 600000,
    description: "Thuê homestay 2 đêm",
    paidBy: "demo-user-1",
    paidByName: "An",
    createdAt: new Date("2025-12-20T07:00:00"),
  },
  {
    id: "demo-expense-2",
    tripId: "demo-trip-001",
    amount: 400000,
    description: "Thuê xe máy 3 ngày",
    paidBy: "demo-user-1",
    paidByName: "An",
    createdAt: new Date("2025-12-20T08:00:00"),
  },
  {
    id: "demo-expense-3",
    tripId: "demo-trip-001",
    amount: 200000,
    description: "Xăng xe",
    paidBy: "demo-user-1",
    paidByName: "An",
    createdAt: new Date("2025-12-21T09:00:00"),
  },
  {
    id: "demo-expense-4",
    tripId: "demo-trip-001",
    amount: 450000,
    description: "Vé tham quan vườn hoa",
    paidBy: "demo-user-2",
    paidByName: "Bình",
    createdAt: new Date("2025-12-20T14:00:00"),
  },
  {
    id: "demo-expense-5",
    tripId: "demo-trip-001",
    amount: 350000,
    description: "Ăn trưa lẩu gà lá é",
    paidBy: "demo-user-2",
    paidByName: "Bình",
    createdAt: new Date("2025-12-20T12:00:00"),
  },
  {
    id: "demo-expense-6",
    tripId: "demo-trip-001",
    amount: 200000,
    description: "Cà phê view đẹp",
    paidBy: "demo-user-2",
    paidByName: "Bình",
    createdAt: new Date("2025-12-21T15:00:00"),
  },
  {
    id: "demo-expense-7",
    tripId: "demo-trip-001",
    amount: 300000,
    description: "Ăn tối BBQ",
    paidBy: "demo-user-3",
    paidByName: "Châu",
    createdAt: new Date("2025-12-20T19:00:00"),
  },
  {
    id: "demo-expense-8",
    tripId: "demo-trip-001",
    amount: 200000,
    description: "Trà sữa + bánh tráng",
    paidBy: "demo-user-3",
    paidByName: "Châu",
    createdAt: new Date("2025-12-21T16:00:00"),
  },
  {
    id: "demo-expense-9",
    tripId: "demo-trip-001",
    amount: 180000,
    description: "Ăn sáng bánh mì",
    paidBy: "demo-user-4",
    paidByName: "Dũng",
    createdAt: new Date("2025-12-21T07:30:00"),
  },
  {
    id: "demo-expense-10",
    tripId: "demo-trip-001",
    amount: 120000,
    description: "Nước uống + snack",
    paidBy: "demo-user-4",
    paidByName: "Dũng",
    createdAt: new Date("2025-12-20T10:00:00"),
  },
];

/**
 * Check if a trip ID belongs to demo data
 */
export const isDemoTrip = (tripId: string): boolean => {
  return tripId.startsWith("demo-");
};

/**
 * Check if an expense ID belongs to demo data
 */
export const isDemoExpense = (expenseId: string): boolean => {
  return expenseId.startsWith("demo-");
};

/**
 * Get demo trip by ID
 */
export const getDemoTripById = (tripId: string): Trip | null => {
  if (tripId === DEMO_TRIP.id) {
    return DEMO_TRIP;
  }
  return null;
};

/**
 * Get demo expenses for a trip
 */
export const getDemoExpenses = (tripId: string): Expense[] => {
  if (tripId === DEMO_TRIP.id) {
    return DEMO_EXPENSES;
  }
  return [];
};
