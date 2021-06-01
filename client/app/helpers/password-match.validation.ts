import { AbstractControl } from '@angular/forms';

export const mustMatchPassword = (controlName: string, matchingControlName: string) => {
    return (control: AbstractControl): { mismatch: boolean } | null => {
        const input = control.get(controlName);
        const matchingInput = control.get(matchingControlName);

        if (matchingInput?.errors && !matchingInput.errors.mismatch) {
            return null;
        }

        if (input?.value !== matchingInput?.value) {
            matchingInput?.setErrors({ mismatch: true });
            return { mismatch: true };
        } else {
            matchingInput?.setErrors(null);
            return null;
        }
    };
};
