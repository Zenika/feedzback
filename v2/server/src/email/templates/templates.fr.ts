import { buildHtmlPage } from './template';
import { EmailBuilders } from './templates.types';

export const emailBuilders: EmailBuilders = {
  buildRequestFeedback: (receiverEmail, message, tokenId) => ({
    subject: 'Demande de FeedZback',

    html: buildHtmlPage(
      'fr',
      'Demande de FeedZback',
      `
      ${
        message
          ? `<p>Le message suivant vous a été envoyée par ${receiverEmail} :<br /> ${message}</p>`
          : `<p>Une demande de FeedZback vous a été envoyée par ${receiverEmail}.</p>`
      }
      
      <p>
        <strong>Répondre à cette demande de FeedZback :</strong><br />
        <a href="${'http://localhost:4200/give?token=' + tokenId}">
          ${'http://localhost:4200/give?token=' + tokenId}
        </a>
      </p>
    `,
    ),
  }),
};
