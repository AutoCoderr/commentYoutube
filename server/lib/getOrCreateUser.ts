import User from "../models/User";

export default async function getOrCreateUser(userData) {
    let user: null|User = await User.findOne({where: {id: userData.id}});
    if (user == null) {
        user = await new User(userData).save();
    }
    return user;
}