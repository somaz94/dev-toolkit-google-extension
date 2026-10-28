import { generateUUID } from '../utils/uuidUtils.js';

export default {
  id: 'uuid',
  action: 'actionGenerateUuid',
  placeholder: 'placeholderUuid',
  allowEmpty: true,
  run: (input) => generateUUID(input),
};
