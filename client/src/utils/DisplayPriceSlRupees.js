// Function to format a given price into Sri Lankan Rupees (LKR) with a dot decimal separator
export const DisplayPriceSlRupees = (price) => {
    const formatter = new Intl.NumberFormat('en-US', { // Use 'en-US' for dot decimal
      style: 'currency',   // Format as currency
      currency: 'LKR',     // Specify the currency as Sri Lankan Rupees
      minimumFractionDigits: 2,  // Always show two decimal places
      maximumFractionDigits: 2,  // Ensure no more than two decimal places
    });
  
    return formatter.format(price);
  };
  