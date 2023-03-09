export function handleError(error: any) {
    if (error?.response?.data?.errorMsg) {
        alert(error.response.data.errorMsg)
        return;
    }
    alert(error.message);
}