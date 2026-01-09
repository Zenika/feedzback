import { HttpErrorResponse } from '@angular/common/http';

const preRequestFeedbackErrMsg = {
  token_invalid: $localize`:@@Component.PreRequestFeedback.TokenInvalid:Le lien magique est invalide ou a été supprimé.`,
  token_expired: $localize`:@@Component.PreRequestFeedback.TokenExpired:Le lien magique a expiré.`,
  token_max_uses_reached: $localize`:@@Component.PreRequestFeedback.TokenMaxUsesReached:La limite d'utilisation du lien magique a été atteinte.`,
  recipient_already_used: $localize`:@@Component.PreRequestFeedback.RecipientAlreadyUsed:Un email a déjà été envoyé à cette adresse. Veuillez vérifier votre boîte de réception ou réessayer avec une autre adresse.`,
  recipient_forbidden: $localize`:@@Component.PreRequestFeedback.RecipientForbidden:Vous ne pouvez pas répondre à votre propre demande de feedZback.`,
};

export const getPreRequestFeedbackErrMsg = ({ status, error }: HttpErrorResponse) => {
  if (status === 400) {
    if (error.message === 'token_invalid') {
      return preRequestFeedbackErrMsg['token_invalid'];
    } else {
      return $localize`:@@Message.ErrorOccured:Une erreur s'est produite.`;
    }
  }
  return (preRequestFeedbackErrMsg as Record<string, string | undefined>)[error?.message];
};
