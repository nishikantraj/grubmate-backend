export const createFoodRatingTable = `
    CREATE TABLE IF NOT EXISTS foodRating(
        ratingId VARCHAR(255) primary key,
        foodQuality int not null,
        ambience int not null,
        service int not null,
        valueForMoney int not null,
        postId varchar(255) not null,
        FOREIGN KEY (postId) REFERENCES posts(postId)
    );
`;