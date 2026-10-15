export const formatAcademicYear = (
  value: string | null | undefined,
): string => {
  if (!value) {
    return "-";
  }

  return value.replace(/^Academic Year\s*/i, "").trim() || "-";
};

