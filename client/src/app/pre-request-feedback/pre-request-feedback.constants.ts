import { HttpErrorResponse } from '@angular/common/http';

const preRequestFeedbackErrMsg = {
  token_invalid: $localize`:@@Component.PreRequestFeedback.TokenInvalid:Le lien partagé pour cette demande de FeedZback est invalide ou a été supprimé.`,
  token_expired: $localize`:@@Component.PreRequestFeedback.TokenExpired:Le lien partagé pour cette demande de FeedZback a expiré.`,
  token_max_uses_reached: $localize`:@@Component.PreRequestFeedback.TokenMaxUsesReached:La limite de partage a été atteinte pour cette demande de FeedZback.`,
  recipient_already_used: $localize`:@@Component.PreRequestFeedback.RecipientAlreadyUsed:Vous avez déjà renseigné cet email pour cette demande de FeedZback. Veuillez consulter votre boîte de réception.`,
  recipient_forbidden: $localize`:@@Component.PreRequestFeedback.RecipientForbidden:Vous ne pouvez pas répondre à votre propre demande de FeedZback.`,
};

export const getPreRequestFeedbackErrMsg = ({ status, error }: HttpErrorResponse) => {
  if (status === 400) {
    return preRequestFeedbackErrMsg['token_invalid'];
  }
  return (preRequestFeedbackErrMsg as Record<string, string | undefined>)[error?.message];
};
