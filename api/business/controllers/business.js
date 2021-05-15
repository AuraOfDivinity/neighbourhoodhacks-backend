'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async review(ctx) {
        const { id } = ctx.params
        const { rating, review } = ctx.request.body;
        const createdReview = await strapi.query('review').create({rating, review});
        
        const businessResponse = await strapi.query('business').findOne({ id });
        if(!businessResponse){
            ctx.badRequest({'message':'Invalid business ID. No business details available for the specified id.'});
        }
        let numberOfRatings = businessResponse.numberOfReviews + 1;
        let total = businessResponse.total + rating;
        let averageRating = total / numberOfRatings;

        const updateResponse = await strapi.query('business').update({id}, {
            reviews: [...businessResponse.reviews, createdReview.id],
            numberOfReviews: numberOfRatings,
            total,
            averageRating
        })


        ctx.send({'message': 'success', 'data':updateResponse})
    },

    async search(ctx) {
        const { searchTerm } = ctx.request.body;
        
        const searchResponse = await strapi.query('business').search({ _q: searchTerm , _limit: 10 });
        console.log(searchResponse)

        ctx.send({'message': 'success', 'data':searchResponse})
    }
};
