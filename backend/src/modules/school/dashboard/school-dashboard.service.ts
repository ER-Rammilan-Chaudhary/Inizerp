import { prisma } from "../../../config/prisma";

export const getSchoolEnabledModuleKeysService = async (
  schoolId: string,
) => {
  const assignments = await prisma.schoolModule.findMany({
    where: {
      schoolId,
      enabled: true,
      module: {
        isActive: true,
      },
    },
    select: {
      module: {
        select: {
          key: true,
        },
      },
    },
  });

  if (assignments.length > 0) {
    return assignments.map(({ module }) => module.key.toUpperCase());
  }

  const defaultModules = await prisma.eRPModule.findMany({
    where: {
      isActive: true,
    },
    select: {
      key: true,
    },
  });

  return defaultModules.map((m) => m.key.toUpperCase());
};

export const getSchoolDashboardService = async (schoolId: string) => {
  const today = new Date();

  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);

  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 6);

  const currentAcademicYear = await prisma.academicYear.findFirst({
    where: {
      schoolId,
      isCurrent: true,
      isActive: true,
      isDeleted: false,
    },
    orderBy: {
      startDate: "desc",
    },
    select: {
      id: true,
      name: true,
      code: true,
      startDate: true,
      endDate: true,
      isCurrent: true,
      isActive: true,
    },
  });

  const [
    school,
    studentCount,
    teacherCount,
    parentCount,
    staffCount,
    classCount,
    sectionCount,
    subjectCount,
    todayAttendance,
    weeklyAttendance,
    attendanceByClassRows,
    feeSummary,
    feeBreakdown,
    overdueFees,
    pendingAdmissions,
    upcomingExams,
    upcomingEvents,
    recentAnnouncements,
    recentPayments,
    recentAdmissions,
    recentNotifications,
  ] = await Promise.all([
    prisma.school.findFirst({
      where: {
        id: schoolId,
        isDeleted: false,
      },
      select: {
        id: true,
        code: true,
        name: true,
        slug: true,
        logo: true,
        primaryColor: true,
        secondaryColor: true,
        timezone: true,
        currency: true,
        status: true,
        isActive: true,
        isVerified: true,
      },
    }),

    prisma.student.count({
      where: {
        schoolId,
        isDeleted: false,
      },
    }),

    prisma.teacher.count({
      where: {
        schoolId,
      },
    }),

    prisma.parent.count({
      where: {
        schoolId,
      },
    }),

    prisma.staff.count({
      where: {
        schoolId,
        isDeleted: false,
      },
    }),

    prisma.class.count({
      where: {
        schoolId,
      },
    }),

    prisma.section.count({
      where: {
        schoolId,
      },
    }),

    prisma.subject.count({
      where: {
        schoolId,
      },
    }),

    prisma.attendance.groupBy({
      by: ["status"],
      where: {
        schoolId,
        attendanceDate: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      _count: {
        _all: true,
      },
    }),

    prisma.attendance.findMany({
      where: {
        schoolId,
        attendanceDate: {
          gte: startOfWeek,
          lte: endOfToday,
        },
      },
      select: {
        attendanceDate: true,
        status: true,
      },
    }),

    prisma.attendance.groupBy({
      by: ["classId", "status"],
      where: {
        schoolId,
        attendanceDate: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      _count: {
        _all: true,
      },
    }),

    prisma.fee.aggregate({
      where: {
        schoolId,
      },
      _sum: {
        amount: true,
        paidAmount: true,
      },
    }),

    prisma.fee.groupBy({
      by: ["title"],
      where: {
        schoolId,
      },
      _sum: {
        amount: true,
        paidAmount: true,
      },
    }),

    prisma.fee.aggregate({
      where: {
        schoolId,
        status: "OVERDUE",
      },
      _count: {
        _all: true,
      },
      _sum: {
        amount: true,
        paidAmount: true,
      },
    }),

    prisma.admission.count({
      where: {
        schoolId,
        isDeleted: false,
        status: {
          in: ["PENDING", "UNDER_REVIEW"],
        },
      },
    }),

    prisma.exam.findMany({
      where: {
        schoolId,
        endDate: {
          gte: startOfToday,
        },
      },
      orderBy: {
        startDate: "asc",
      },
      take: 5,
      select: {
        id: true,
        name: true,
        examType: true,
        startDate: true,
        endDate: true,
      },
    }),

    prisma.event.findMany({
      where: {
        schoolId,
        OR: [
          {
            startDate: {
              gte: startOfToday,
            },
          },
          {
            endDate: {
              gte: startOfToday,
            },
          },
        ],
      },
      orderBy: {
        startDate: "asc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        location: true,
      },
    }),

    prisma.announcement.findMany({
      where: {
        schoolId,
        OR: [
          {
            expiresAt: null,
          },
          {
            expiresAt: {
              gte: today,
            },
          },
        ],
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        message: true,
        publishedAt: true,
        expiresAt: true,
      },
    }),

    prisma.payment.findMany({
      where: {
        schoolId,
      },
      orderBy: {
        paymentDate: "desc",
      },
      take: 5,
      select: {
        id: true,
        receiptNo: true,
        amount: true,
        paymentDate: true,
        method: true,
        status: true,
      },
    }),

    prisma.admission.findMany({
      where: {
        schoolId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        applicationNo: true,
        studentName: true,
        status: true,
        createdAt: true,
      },
    }),

    prisma.notification.findMany({
      where: {
        schoolId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        message: true,
        type: true,
        priority: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  if (!school) {
    return null;
  }

  const attendance: Record<string, number> = {
    PRESENT: 0,
    ABSENT: 0,
    LATE: 0,
    LEAVE: 0,
  };

  for (const item of todayAttendance) {
    attendance[item.status] = item._count._all;
  }

  const totalAttendance =
    attendance.PRESENT +
    attendance.ABSENT +
    attendance.LATE +
    attendance.LEAVE;

  const attendancePercentage =
    totalAttendance > 0
      ? Number(
          (
            ((attendance.PRESENT + attendance.LATE) / totalAttendance) *
            100
          ).toFixed(2),
        )
      : 0;

  const weeklyMap = new Map<
    string,
    {
      present: number;
      absent: number;
      late: number;
      leave: number;
      total: number;
    }
  >();

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);

    date.setDate(startOfWeek.getDate() + i);

    const key = date.toISOString().split("T")[0];

    weeklyMap.set(key, {
      present: 0,
      absent: 0,
      late: 0,
      leave: 0,
      total: 0,
    });
  }

  for (const item of weeklyAttendance) {
    const key = item.attendanceDate.toISOString().split("T")[0];

    const day = weeklyMap.get(key);

    if (!day) {
      continue;
    }

    day.total += 1;

    if (item.status === "PRESENT") {
      day.present += 1;
    } else if (item.status === "ABSENT") {
      day.absent += 1;
    } else if (item.status === "LATE") {
      day.late += 1;
    } else if (item.status === "LEAVE") {
      day.leave += 1;
    }
  }

  const weekly = Array.from(weeklyMap.entries()).map(([date, value]) => ({
    date,
    day: new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    present: value.present,
    absent: value.absent,
    late: value.late,
    leave: value.leave,
    total: value.total,
    percentage:
      value.total > 0
        ? Number(
            (((value.present + value.late) / value.total) * 100).toFixed(2),
          )
        : 0,
  }));

  const classIds = [
    ...new Set(
      attendanceByClassRows
        .map((item) => item.classId)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  const classes =
    classIds.length > 0
      ? await prisma.class.findMany({
          where: {
            schoolId,
            id: {
              in: classIds,
            },
          },
          select: {
            id: true,
            name: true,
          },
        })
      : [];

  const classMap = new Map(
    classes.map((item) => [item.id, item.name]),
  );

  const byClassMap = new Map<
    string,
    {
      present: number;
      absent: number;
      late: number;
      leave: number;
      total: number;
    }
  >();

  for (const item of attendanceByClassRows) {
    if (!item.classId) {
      continue;
    }

    const current = byClassMap.get(item.classId) ?? {
      present: 0,
      absent: 0,
      late: 0,
      leave: 0,
      total: 0,
    };

    const count = item._count._all;

    current.total += count;

    if (item.status === "PRESENT") {
      current.present += count;
    } else if (item.status === "ABSENT") {
      current.absent += count;
    } else if (item.status === "LATE") {
      current.late += count;
    } else if (item.status === "LEAVE") {
      current.leave += count;
    }

    byClassMap.set(item.classId, current);
  }

  const attendanceByClass = Array.from(byClassMap.entries()).map(
    ([classId, value]) => ({
      classId,
      className: classMap.get(classId) ?? "Unknown",
      present: value.present,
      absent: value.absent,
      late: value.late,
      leave: value.leave,
      total: value.total,
      percentage:
        value.total > 0
          ? Number(
              (((value.present + value.late) / value.total) * 100).toFixed(2),
            )
          : 0,
    }),
  );

  const totalFees = Number(feeSummary._sum.amount ?? 0);
  const paidFees = Number(feeSummary._sum.paidAmount ?? 0);
  const pendingFees = Math.max(totalFees - paidFees, 0);

  const feeRealization =
    totalFees > 0
      ? Number(((paidFees / totalFees) * 100).toFixed(2))
      : 0;

  const feeBreakdownData = feeBreakdown.map((item) => {
    const amount = Number(item._sum.amount ?? 0);
    const paid = Number(item._sum.paidAmount ?? 0);

    return {
      name: item.title,
      amount,
      paid,
      pending: Math.max(amount - paid, 0),
      percentage:
        totalFees > 0
          ? Number(((amount / totalFees) * 100).toFixed(2))
          : 0,
    };
  });

  const weeklyAttendanceData = weekly.filter(
    (item) => item.total > 0,
  );

  const weeklyAverage =
    weeklyAttendanceData.length > 0
      ? Number(
          (
            weeklyAttendanceData.reduce(
              (sum, item) => sum + item.percentage,
              0,
            ) / weeklyAttendanceData.length
          ).toFixed(2),
        )
      : 0;

  const operationalAlerts: Array<Record<string, unknown>> = [];

  if (pendingAdmissions > 0) {
    operationalAlerts.push({
      type: "ADMISSIONS",
      priority: "HIGH",
      title: "Pending Admissions",
      count: pendingAdmissions,
      message: `${pendingAdmissions} admission applications are pending review`,
    });
  }

  if (overdueFees._count._all > 0) {
    operationalAlerts.push({
      type: "FEES",
      priority: "HIGH",
      title: "Overdue Fees",
      count: overdueFees._count._all,
      amount: Number(overdueFees._sum.amount ?? 0),
      message: `${overdueFees._count._all} fee records are overdue`,
    });
  }

  const lowAttendanceClasses = attendanceByClass.filter(
    (item) => item.total > 0 && item.percentage < 85,
  );

  for (const item of lowAttendanceClasses.slice(0, 3)) {
    operationalAlerts.push({
      type: "ATTENDANCE",
      priority: "HIGH",
      title: `${item.className} Low Attendance`,
      count: item.total,
      percentage: item.percentage,
      message: `Attendance is ${item.percentage}% today`,
    });
  }

  const liveFeed = [
    ...recentPayments.map((payment) => ({
      id: payment.id,
      type: "FEE_RECEIPT",
      title: "Fee Receipt",
      description: `Receipt ${payment.receiptNo} received`,
      amount: Number(payment.amount),
      status: payment.status,
      method: payment.method,
      timestamp: payment.paymentDate,
    })),

    ...recentAdmissions.map((admission) => ({
      id: admission.id,
      type: "ADMISSION",
      title: "New Admission",
      description: `${admission.studentName} - ${admission.applicationNo}`,
      status: admission.status,
      timestamp: admission.createdAt,
    })),

    ...recentNotifications.map((notification) => ({
      id: notification.id,
      type: "NOTIFICATION",
      title: notification.title,
      description: notification.message,
      priority: notification.priority,
      status: notification.status,
      timestamp: notification.createdAt,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime(),
    )
    .slice(0, 10);

  const todayDay = today
    .toLocaleDateString("en-US", {
      weekday: "long",
    })
    .toUpperCase();

  const todayScheduleData = await prisma.timetable.findMany({
    where: {
      schoolId,
      ...(currentAcademicYear?.id
        ? {
            academicYearId: currentAcademicYear.id,
          }
        : {}),
      day: {
        equals: todayDay,
        mode: "insensitive",
      },
    },
    orderBy: {
      period: "asc",
    },
    select: {
      id: true,
      day: true,
      startTime: true,
      endTime: true,
      period: true,
      roomNo: true,
      class: {
        select: {
          id: true,
          name: true,
        },
      },
      section: {
        select: {
          id: true,
          name: true,
        },
      },
      subject: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      teacher: {
        select: {
          id: true,
          employeeId: true,
          designation: true,
          user: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
      },
    },
  });

  const todaySchedule = todayScheduleData.map((item) => ({
    id: item.id,
    period: item.period,
    startTime: item.startTime,
    endTime: item.endTime,
    roomNo: item.roomNo,
    class: item.class,
    section: item.section,
    subject: item.subject,
    teacher: item.teacher,
    status: "UPCOMING",
  }));

  const reports = [
    {
      key: "ATTENDANCE_PDF",
      title: "Today's Attendance PDF",
      type: "PDF",
      available: true,
    },
    {
      key: "FEE_DEFAULTER_EXCEL",
      title: "Fee Defaulter List",
      type: "EXCEL",
      available: true,
    },
    {
      key: "ACADEMIC_CALENDAR",
      title: "Academic Calendar",
      type: "ICAL",
      available: true,
    },
  ];

  const quickActions = [
    {
      key: "NEW_ADMISSION",
      title: "New Admission",
    },
    {
      key: "COLLECT_FEE",
      title: "Collect Fee",
    },
    {
      key: "MARK_ATTENDANCE",
      title: "Mark Attendance",
    },
    {
      key: "PUBLISH_NOTICE",
      title: "Publish Notice",
    },
    {
      key: "SCHEDULE_EXAM",
      title: "Schedule Exam",
    },
    {
      key: "TRACK_BUSES",
      title: "Track Buses",
    },
  ];

  return {
    school,

    summary: {
      students: studentCount,
      teachers: teacherCount,
      parents: parentCount,
      staff: staffCount,
      classes: classCount,
      sections: sectionCount,
      subjects: subjectCount,
    },

    academicYear: currentAcademicYear,

    attendance: {
      date: startOfToday,
      present: attendance.PRESENT,
      absent: attendance.ABSENT,
      late: attendance.LATE,
      leave: attendance.LEAVE,
      total: totalAttendance,
      percentage: attendancePercentage,

      today: {
        present: attendance.PRESENT,
        absent: attendance.ABSENT,
        late: attendance.LATE,
        leave: attendance.LEAVE,
        total: totalAttendance,
        percentage: attendancePercentage,
      },

      weekly,

      byClass: attendanceByClass,

      statistics: {
        weeklyAverage,
        highest:
          weekly.length > 0
            ? Math.max(
                ...weekly.map((item) => item.percentage),
              )
            : 0,
      },
    },

    fees: {
      total: totalFees,
      paid: paidFees,
      pending: pendingFees,

      summary: {
        target: totalFees,
        paid: paidFees,
        pending: pendingFees,
        overdue: Number(overdueFees._sum.amount ?? 0),
        overdueCount: overdueFees._count._all,
        realizationPercentage: feeRealization,
      },

      breakdown: feeBreakdownData,
    },

    admissions: {
      pending: pendingAdmissions,
    },

    todaySchedule,
    upcomingExams,
    upcomingEvents,
    operationalAlerts,
    liveFeed,
    announcements: recentAnnouncements,
    reports,
    quickActions,
  };
};

