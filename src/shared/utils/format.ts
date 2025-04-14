export const formatDate = (date: Date) => {
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(localDate);
}

export const formatDateForParam = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0'); 
    
    return `${year}-${month}-${day}`;
}

export const formatAmountToCRC = (amount: number) => {
    return `CRC ${amount.toLocaleString('es-CR', { minimumFractionDigits: 2 })}`;
  };  