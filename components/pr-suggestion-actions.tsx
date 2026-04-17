import { Button } from "@/components/ui/button";
import type { PullRequestSuggestionStatus } from "@/types/pr-analysis";

type PullRequestSuggestionActionsProps = {
  status: PullRequestSuggestionStatus;
  isEditing: boolean;
  isSaveDisabled: boolean;
  onApprove: () => void;
  onReject: () => void;
  onResetToPending: () => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
};

export function PullRequestSuggestionActions({
  status,
  isEditing,
  isSaveDisabled,
  onApprove,
  onReject,
  onResetToPending,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
}: PullRequestSuggestionActionsProps) {
  if (isEditing) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="primary"
          onClick={onSaveEdit}
          disabled={isSaveDisabled}
        >
          Salvar
        </Button>
        <Button variant="ghost" onClick={onCancelEdit}>
          Cancelar
        </Button>
      </div>
    );
  }

  if (status === "approved") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" onClick={onResetToPending}>
          Desfazer
        </Button>
        <Button variant="secondary" onClick={onStartEdit}>
          Editar
        </Button>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" onClick={onResetToPending}>
          Reconsiderar
        </Button>
        <Button variant="secondary" onClick={onStartEdit}>
          Editar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="positive" onClick={onApprove}>
        Aprovar
      </Button>
      <Button variant="danger" onClick={onReject}>
        Rejeitar
      </Button>
      <Button variant="secondary" onClick={onStartEdit}>
        Editar
      </Button>
    </div>
  );
}
