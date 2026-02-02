"use client";

import RetroButton from "./RetroButton";

type Props = {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({ open, message, onConfirm, onCancel }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="retro-panel w-full max-w-md rounded-2xl p-6">
        <div className="retro-title mb-4 text-xl text-amber-900">확인</div>
        <div className="text-sm text-amber-900">{message}</div>
        <div className="mt-6 flex justify-end gap-2">
          <RetroButton type="button" variant="secondary" onClick={onCancel}>
            취소
          </RetroButton>
          <RetroButton type="button" onClick={onConfirm}>
            확인
          </RetroButton>
        </div>
      </div>
    </div>
  );
}
