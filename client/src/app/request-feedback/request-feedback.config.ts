export const REQUEST_TEMPLATES = [
  {
    title: $localize`:@@Component.RequestFeedback.Template.StartingAtZenikaTitle:Débuts à Zenika`,
    content: $localize`:@@Component.RequestFeedback.Template.StartingAtZenikaContent:Bonjour,\nSi tu as quelques minutes, j'aimerais avoir ton feedback sur mes débuts à Zenika.\nCela peut être quelque chose de positif que tu as remarqué ou quelque chose que je pourrais améliorer.\nMerci par avance.`,
  },
  {
    title: $localize`:@@Component.RequestFeedback.Template.StartOfAssignmentTitle:Début de mission`,
    content: $localize`:@@Component.RequestFeedback.Template.StartOfAssignmentContent:Bonjour,\nCela fait un moment que j'ai commencé ma mission et j'aimerais avoir ton feedback sur ce que je fais bien et ce que je pourrais améliorer.\nMerci par avance.`,
  },
  {
    title: $localize`:@@Component.RequestFeedback.Template.EndOfAssignmentTitle:Fin de mission`,
    content: $localize`:@@Component.RequestFeedback.Template.EndOfAssignmentContent:Bonjour,\nComme tu le sais, ma mission se termine bientôt et j'aimerais avoir ton feedback sur ma prestation, ce que j'ai réussi et ce que je pourrais améliorer.\nMerci par avance.`,
  },
  {
    title: $localize`:@@Component.RequestFeedback.Template.AnnualReviewTitle:Entretien annuel`,
    content: $localize`:@@Component.RequestFeedback.Template.AnnualReviewContent:Bonjour,\nEn vue de mon entretien annuel qui a lieu bientôt, j'aimerais avoir ton feedback sur ce que je fais bien et ce que je pourrais améliorer.\nMerci par avance.`,
  },
  {
    title: $localize`:@@Component.RequestFeedback.Template.ConferenceTitle:Conférence`,
    content: $localize`:@@Component.RequestFeedback.Template.ConferenceContent:Bonjour,\nRécemment, j'ai donné une conférence à laquelle tu as assisté et j'aimerais avoir ton feedback sur ce qui a bien fonctionné et ce que je pourrais améliorer.\nMerci par avance.`,
  },
] as const;

export const FEEDBACK_PRE_REQUEST_EXPIRATION_IN_DAYS = 3; // (not `4` like on server-side)
export const FEEDBACK_PRE_REQUEST_MAX_USES = 20;
