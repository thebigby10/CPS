const { sanitize } = require("@strapi/utils");
const utils = require("@strapi/utils");

module.exports = {
  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized("You're not logged in");
    }

    const fullUser = await strapi.entityService.findOne(
      "plugin::users-permissions.user",
      user.id,
      {
        populate: ["role"], // 👈 This line adds the role info
      },
    );

    const sanitizedUser = await sanitize.contentAPI.output(
      fullUser,
      strapi.getModel("plugin::users-permissions.user"),
    );

    ctx.body = sanitizedUser;
  },
};
