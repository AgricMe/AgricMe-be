export default () => ({
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  port: parseInt(process.env.PORT),
  mailerUser: process.env.MAILER_USER,
  mailerPassword: process.env.MAILER_PASSWORD,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallBackUrl: process.env.GOOGLE_CALLBACK_URL,
  facebookAppId: process.env.FACEBOOK_APP_ID,
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
  facebookCallBackUrl: process.env.FACEBOOK_CALLBACK_URL,
  frontendUrl: process.env.FRONTEND_URL
});
