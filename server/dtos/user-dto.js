module.exports = class UserDto {
    email;
    isActivated;
    id;
    role;
    avatarUrl;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.role = model.role;
        this.avatarUrl = model.avatarUrl;
    }
}
