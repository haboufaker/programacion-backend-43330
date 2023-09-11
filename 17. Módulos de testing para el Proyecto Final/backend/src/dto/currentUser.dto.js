export default class CurrentUserDTO {
    constructor(user) {
        this.name = user.first_name + ' ' + user.last_name;
        this.email = user.email;
    }
}