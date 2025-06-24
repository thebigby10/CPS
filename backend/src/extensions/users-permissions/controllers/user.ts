// path: src/extensions/users-permissions/controllers/user.ts

export default {
  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized();
    }

    // Populate the role with proper typing
    const userWithRole = await strapi.entityService.findOne(
      "plugin::users-permissions.user",
      user.id,
      { populate: ["role"] },
    );

    ctx.body = userWithRole;
  },
};
