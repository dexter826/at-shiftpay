import { employeeService } from '@/services/employeeService';
import { eventService } from '@/services/eventService';
import { shiftService } from '@/services/shiftService';
import { paymentService } from '@/services/paymentService';
import { settingsService } from '@/services/settingsService';
import { locationService } from '@/services/locationService';
import { imageService } from '@/services/imageService';
import { exportDetailedReport } from '@/services/exportService';
import { vietQRService } from '@/services/vietqrService';

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
