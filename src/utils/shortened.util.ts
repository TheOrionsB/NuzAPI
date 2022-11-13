import IShortened from "../types/Shortened";
export const validateShortened = (toValidate: IShortened): boolean => {
    if (!toValidate.name || !toValidate.source || !toValidate.target) return false;
    if (toValidate.passwordProtected === true && !toValidate.password) return false;
    if (toValidate.isExpiringEnabled === true && !toValidate.expiresAt) return false;
    return true;
}