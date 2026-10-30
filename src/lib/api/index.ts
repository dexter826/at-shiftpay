import { employeeService } from '@/lib/api/employeeService';
import { eventService } from '@/lib/api/eventService';
import { shiftService } from '@/lib/api/shiftService';
import { paymentService } from '@/lib/api/paymentService';
import { settingsService } from '@/lib/api/settingsService';
import { locationService } from '@/lib/api/locationService';
import { imageService } from '@/lib/api/imageService';
import { exportDetailedReport } from '@/lib/api/exportService';
import { vietQRService } from '@/lib/api/vietqrService';

export const dbService = {
  ...employeeService,
  ...eventService,
  ...shiftService,
  ...paymentService,
  ...settingsService,
  ...locationService,
  ...imageService,
  exportDetailedReport,
  vietQRService,
};

export { deleteField } from 'firebase/firestore';
