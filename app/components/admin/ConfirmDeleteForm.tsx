"use client";

import type { ReactNode } from "react";

type DeleteAction = (formData: FormData) => unknown;

export function ConfirmDeleteForm({
  action,
  confirmText,
  children,
  className,
}: {
  action: DeleteAction;
  confirmText: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <form
      action={async (formData) => {
        await action(formData);
      }}
      className={className}
      onSubmit={(event) => {
        if (!window.confirm(confirmText)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </form>
  );
}
