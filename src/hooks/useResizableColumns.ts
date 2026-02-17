import React from 'react';

/**
 * Lightweight stub for resizable columns.
 * Returns no-op header props and a hidden resize handle.
 */
export const useResizableColumns = (_storageKey: string) => {
  const getHeaderProps = (_key: string) => ({});

  const ResizeHandle = ({ columnKey: _columnKey }: { columnKey: string }) => null;

  return { getHeaderProps, ResizeHandle };
};
