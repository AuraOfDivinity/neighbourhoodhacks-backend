'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async review(ctx) {
        const { id } = ctx.params
        const { tagId } = ctx.request.body
        const user = await strapi.plugins['users-permissions'].services.user.fetch({
            id: ctx.state.user._id,
          });
        
        const tagResponse = await strapi.query('tag').findOne({ id: tagId });
        if(!tagResponse){
            ctx.badRequest({'message':'Invalid tag ID'});
        }

        let updatedUser = user;
        updatedUser.user_preferences.push(tagResponse);

        console.log(tagResponse)
        console.log(updatedUser.user_preferences)

        let data = await strapi.query('user', 'users-permissions').update({id:user.id}, updatedUser);

        ctx.send({'message': 'success', 'data': data})
    }
};
