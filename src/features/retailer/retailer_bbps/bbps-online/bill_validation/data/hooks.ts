import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { apiPostBillValidation } from './endpoint';
import { BillValidationRequest } from '../domain/types';

/** -------- Bill Validation (mutation, POST) -------- */
type BillValidationVars = {
  serviceId: string; 
  mode: 'ONLINE' | 'OFFLINE';
  body: BillValidationRequest;
};

export function useBbpsBillValidationMutation<TResp = unknown>(
  _opt?: UseMutationOptions<TResp, Error, BillValidationVars>
) {
  return useMutation<TResp, Error, BillValidationVars>({
    mutationKey: ['bbps', 'bill-validation'],
    mutationFn: (vars) =>
      apiPostBillValidation<TResp>(
        { serviceId: vars.serviceId, mode: vars.mode, body: vars.body },
        undefined
      ),
    ..._opt, 
  });
}
