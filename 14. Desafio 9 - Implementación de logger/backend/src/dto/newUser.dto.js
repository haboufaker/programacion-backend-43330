export default class NewUserDTO {
    constructor(newUser) {
        this.first_name = newUser.first_name;
        this.last_name = newUser.last_name;
        this.email = newUser.email;
        this.password = newUser.password;
        this.age = newUser.age;
        this.role = newUser.role;
        this.cart = newUser.cart;
    }
}