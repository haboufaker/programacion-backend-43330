import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

export function generateProduct(){

    const numberOfImages = faker.string.numeric();
    const thumbnail = [];
    for(let i = 0; i < numberOfImages; i++){
        thumbnail.push(faker.image.url())
    }

    const stock = faker.number.int({ min: 0 });
    let availability = true;

    if (stock === 0) {
        availability = false
    }

    const fakerProduct = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        code: uuidv4(),
        stock: stock,
        thumbnail: thumbnail,
        category: faker.commerce.department(),
        availability: availability
    }
    return fakerProduct
}