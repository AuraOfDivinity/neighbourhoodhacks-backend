module.exports = {
    async updateUserTags(ctx) {

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
}