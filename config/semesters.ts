export type SheetConfig = {
  spreadsheetId: string;
  gid: string;
  sheetName?: string;
};

export type SemesterConfig = {
  id: string;
  name: string;
  cashAmount: number;
  paymentSheet: SheetConfig;
  expenseSheet: SheetConfig;
  expenseFormUrl?: string;
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
      spreadsheetId: "1XnTVkCjF62gXDlgLJ4dr7m8RPci1iZVsiUNTW3thS7s",
      gid: "0",
      sheetName: "Form Responses 1",
    },
    expenseFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSe-7ZfUkIWx26KsVNXni8i48lrOxvlwYiiAVoU5pINJzPz5Rw/viewform?usp=sharing",
    isActive: true,
  },
];

export const activeSemesterId = semesters.find((semester) => semester.isActive)?.id ?? semesters[0]?.id;
