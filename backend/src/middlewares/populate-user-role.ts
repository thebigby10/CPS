// src/middlewares/populate-user-role.ts
export default (config: any, { strapi }: { strapi: any }) => {
  return async (ctx: any, next: () => any) => {
    await next();

    if (ctx.status === 200 && ctx.body?.user) {
      const userWithRole = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        ctx.body.user.id,
        { populate: ["role"] },
      );

      if (userWithRole?.role) {
        ctx.body.user.role = userWithRole.role;
      }
    }
  };
};
