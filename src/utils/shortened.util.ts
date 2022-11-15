import IShortened from "../types/Shortened";
export const validateShortened = (toValidate: IShortened): boolean => {
    if (!toValidate.name || !toValidate.source || !toValidate.target) { console.log("failed in first if"); return false; }
    if (toValidate.passwordProtected === true && !toValidate.password) { console.log("failed in second if"); return false; }
    if (toValidate.isExpiringEnabled === true && !toValidate.expiresAt) { console.log("failed in third if"); return false; }
    return true;
}