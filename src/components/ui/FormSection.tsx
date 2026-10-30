import React from 'react';

export const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section className="space-y-3 border-t border-line pt-4">
    <h3 className="font-mono text-mono-label text-ink-muted">{title}</h3>
    {children}
  </section>
);
