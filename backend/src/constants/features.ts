export interface FeatureDefinition {
  key: string;
  label: string;
  description: string;
  defaultEnabled: boolean;
}

export const FEATURES: FeatureDefinition[] = [
  {
    key: "ATTENDANCE",
    label: "Attendance",
    description: "Student attendance management",
    defaultEnabled: true,
  },
  {
    key: "FEES",
    label: "Fees",
    description: "Fee management",
    defaultEnabled: true,
  },
  {
    key: "TRANSPORT",
    label: "Transport",
    description: "Transport management",
    defaultEnabled: true,
  },
  {
    key: "EXAMS",
    label: "Exams",
    description: "Exam & Result management",
    defaultEnabled: true,
  },
  {
    key: "LIBRARY",
    label: "Library",
    description: "Library management",
    defaultEnabled: true,
  },
  {
    key: "HOMEWORK",
    label: "Homework",
    description: "Homework management",
    defaultEnabled: true,
  },
  {
    key: "NOTIFICATIONS",
    label: "Notifications",
    description: "SMS, Email & Push Notifications",
    defaultEnabled: true,
  },
  {
    key: "ADMISSIONS",
    label: "Admissions",
    description: "Admission management",
    defaultEnabled: true,
  },
  {
    key: "STAFF_MANAGEMENT",
    label: "Staff Management",
    description: "Teaching & Non-Teaching Staff",
    defaultEnabled: true,
  },
  {
    key: "ONLINE_CLASSES",
    label: "Online Classes",
    description: "Online class management",
    defaultEnabled: true,
  },
  {
    key: "MOBILE_APP",
    label: "Mobile App",
    description: "Android & iOS mobile application",
    defaultEnabled: true,
  },
];
