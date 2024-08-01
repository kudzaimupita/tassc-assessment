// eslint-disable-next-line import/no-extraneous-dependencies
const { Novu } = require('@novu/node');

class SendNotification {
  constructor(apiKey) {
    this.novu = new Novu(apiKey);
  }

  async sendPasswordResetNotification(subscriberId, email, resetLink, securityEmail) {
    try {
      await this.novu.trigger('password-reset', {
        to: {
          subscriberId,
          email,
        },
        payload: {
          resetLink,
          securityEmail,
        },
      });
    } catch (error) {
      throw new Error(`Error sending password reset notification: ${error.message}`);
    }
  }

  async sendUserWelcomeEmail(subscriberId, email, inviteLink, companyName, username) {
    try {
      await this.novu.trigger('account-activation-VF9YriByJ', {
        to: {
          subscriberId,
          email,
        },
        payload: {
          inviteLink,
          // securityEmail,
          companyName,
          username,
        },
        organization: {
          logo: 'https://unsplash.com/photos/85ey1vFIwkc',
        },
      });

      return 'Password reset notification sent successfully.';
    } catch (error) {
      throw new Error(`Error sending password reset notification: ${error.message}`);
    }
  }
}

module.exports = SendNotification;
