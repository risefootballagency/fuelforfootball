// Player sorting utilities matching Rise Agency

export const sortPlayersByRepresentation = <T extends { representation_status?: string | null }>(players: T[]): T[] => {
  const order: Record<string, number> = {
    'full': 0,
    'active': 1,
    'trial': 2,
    'prospect': 3,
    'inactive': 4,
    'former': 5,
  };
  return [...players].sort((a, b) => {
    const aOrder = order[(a.representation_status || '').toLowerCase()] ?? 99;
    const bOrder = order[(b.representation_status || '').toLowerCase()] ?? 99;
    return aOrder - bOrder;
  });
};

export const getStatusLabel = (status: string | null | undefined): string => {
  if (!status) return '';
  const labels: Record<string, string> = {
    'full': 'Full',
    'active': 'Active',
    'trial': 'Trial',
    'prospect': 'Prospect',
    'inactive': 'Inactive',
    'former': 'Former',
  };
  return labels[status.toLowerCase()] || status;
};
