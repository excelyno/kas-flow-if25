export type SheetConfig = {
  spreadsheetId: string;
  gid: string;
};

export type SemesterConfig = {
  id: string;
  name: string;
  cashAmount: number;
  paymentSheet: SheetConfig;
  expenseSheet: SheetConfig;
  isActive?: boolean;
};

export const semesters: SemesterConfig[] = [
  {
    id: "semester-2",
    name: "Semester 2",
    cashAmount: 15000,
    paymentSheet: {
      spreadsheetId: "1S8seZujKjbOXwWUIpHa6LZHI9mEUkFIF_H4-Y9422iU",
      gid: "1003816535",
    },
    expenseSheet: {
      spreadsheetId: "1YVAOxmJOaaSJVbn_dnodAwn2Y-fYw0LnKOE5IlXn-WA",
      gid: "0",
    },
    isActive: true,
  },
];

export const activeSemesterId = semesters.find((semester) => semester.isActive)?.id ?? semesters[0]?.id;
