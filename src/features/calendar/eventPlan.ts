import { Employee, Event, Shift, ShiftSession } from '@/types/index';

export interface EventDraft {
  date: string;
  title: string;
  locationId: string;
  note: string;
  time: string;
  amount: number;
  surcharge: number;
  surchargeDistributionType: 'equal' | 'selected';
  surchargeSelectedEmployees: Record<string, boolean>;
  assignments: Record<string, boolean>;
  session: ShiftSession;
  userId: string;
}

export interface EventSavePlan {
  eventData: Omit<Event, 'id'>;
  create: Omit<Shift, 'id'>[];
  update: { id: string; data: Partial<Shift> }[];
  remove: string[];
}

interface SurchargeSplit {
  surcharge: number;
  surchargeDistributionType: 'equal' | 'selected';
  assignments: Record<string, boolean>;
  surchargeSelectedEmployees: Record<string, boolean>;
}

export function surchargePerPerson({
  surcharge,
  surchargeDistributionType,
  assignments,
  surchargeSelectedEmployees,
}: SurchargeSplit): number {
  if (surcharge <= 0) return 0;

  const recipients =
    surchargeDistributionType === 'equal'
      ? Object.values(assignments).filter(Boolean).length
      : Object.values(surchargeSelectedEmployees).filter(Boolean).length;

  return recipients > 0 ? Math.round(surcharge / recipients) : 0;
}

export function planEventSave(
  draft: EventDraft,
  employees: Employee[],
  existingShifts: Shift[]
): EventSavePlan {
  const perPerson = surchargePerPerson(draft);

  const create: Omit<Shift, 'id'>[] = [];
  const update: { id: string; data: Partial<Shift> }[] = [];

  for (const [employeeId, isAssigned] of Object.entries(draft.assignments)) {
    if (!isAssigned) continue;

    const employee = employees.find((e) => e.id === employeeId);
    if (!employee) continue;

    const receivesSurcharge =
      draft.surcharge > 0 &&
      (draft.surchargeDistributionType === 'equal' ||
        Boolean(draft.surchargeSelectedEmployees[employeeId]));
    const finalAmount = Math.round(draft.amount + (receivesSurcharge ? perPerson : 0));

    const previousShift = existingShifts.find(
      (s) => s.employeeId === employeeId && s.session === draft.session
    );

    if (previousShift) {
      update.push({
        id: previousShift.id,
        data: { amount: finalAmount, employeeName: employee.name },
      });
    } else {
      create.push({
        eventId: '',
        date: draft.date,
        employeeId,
        employeeName: employee.name,
        session: draft.session,
        amount: finalAmount,
        status: 'unpaid',
        userId: draft.userId,
      });
    }
  }

  const remove = existingShifts.filter((s) => !update.some((u) => u.id === s.id)).map((s) => s.id);

  const surchargeDistribution: Event['surchargeDistribution'] =
    draft.surcharge > 0 ? { type: draft.surchargeDistributionType } : undefined;

  if (surchargeDistribution && draft.surchargeDistributionType === 'selected') {
    surchargeDistribution.selectedEmployeeIds = Object.entries(draft.surchargeSelectedEmployees)
      .filter(([, selected]) => selected)
      .map(([id]) => id);
  }

  const eventData: Omit<Event, 'id'> = {
    date: draft.date,
    title: draft.title,
    locationId: draft.locationId,
    note: draft.note,
    time: draft.time,
    amount: draft.amount,
    surcharge: draft.surcharge,
    userId: draft.userId,
  };

  if (surchargeDistribution) {
    eventData.surchargeDistribution = surchargeDistribution;
  }

  return { eventData, create, update, remove };
}
