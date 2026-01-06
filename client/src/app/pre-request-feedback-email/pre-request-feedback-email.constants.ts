import { HttpErrorResponse } from '@angular/common/http';

const PRE_REQUEST_FEEDBACK_EMAIL_ERR_MSG = {
  token_invalid: $localize`:@@Component.PreRequestFeedbackEmail.TokenInvalid:Le lien partagé pour cette demande de FeedZback est invalide ou a été supprimé.`,
  token_expired: $localize`:@@Component.PreRequestFeedbackEmail.TokenExpired:Le lien partagé pour cette demande de FeedZback a expiré.`,
  token_max_uses_reached: $localize`:@@Component.PreRequestFeedbackEmail.TokenMaxUsesReached:La limite de partage a été atteinte pour cette demande de FeedZback.`,
  recipient_already_used: $localize`:@@Component.PreRequestFeedbackEmail.RecipientAlreadyUsed:Vous avez déjà renseigné cet email pour cette demande de FeedZback. Veuillez consulter votre boîte de réception.`,
  recipient_forbidden: $localize`:@@Component.PreRequestFeedbackEmail.RecipientForbidden:Vous ne pouvez pas répondre à votre propre demande de FeedZback.`,
};

export const getPreRequestFeedbackEmailErrMsg = ({ status, error }: HttpErrorResponse) => {
  if (status === 400) {
    return PRE_REQUEST_FEEDBACK_EMAIL_ERR_MSG['token_invalid'];
  }
  return (PRE_REQUEST_FEEDBACK_EMAIL_ERR_MSG as Record<string, string | undefined>)[error?.message];
};
