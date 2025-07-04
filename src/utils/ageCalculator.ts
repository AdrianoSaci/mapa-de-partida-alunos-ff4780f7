
export const calculateAge = (dateOfBirth: string): string => {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  if (years === 0) {
    return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  } else if (years === 1 && months === 0) {
    return '1 ano';
  } else if (years === 1) {
    return `1 ano e ${months} ${months === 1 ? 'mês' : 'meses'}`;
  } else if (months === 0) {
    return `${years} anos`;
  } else {
    return `${years} anos e ${months} ${months === 1 ? 'mês' : 'meses'}`;
  }
};
