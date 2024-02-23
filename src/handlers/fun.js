
export function convertDateFormat(dateString) {
    // Split the date string into year, month, and day
    const parts = dateString.split('-');
    // Rearrange the parts to DD-MM-YYYY format
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return formattedDate;
}

// Example usage:
// const originalDate = '2024-02-16';
// const convertedDate = convertDateFormat(originalDate);
// console.log(convertedDate); // Output: '16-02-2024'
