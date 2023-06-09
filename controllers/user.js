import User from "../models/user.js"
import bcrypt from "bcryptjs";
import jwt  from "jsonwebtoken";

//this api is for creating a new user.
const signup = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hash });
        await newUser.save();
        res.status(200).send("User has been created!");

    } catch (err) {
        next(err)
    }
}

//this api is for signing in by the user
const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ name: req.body.name });
        if (!user) return next(createError(404, "User not found!"));
        const isCorrect = await bcrypt.compare(req.body.password, user.password);

        if (!isCorrect) return next(createError(400, "Wrong Credentials!"));
        const token = jwt.sign({ id: user._id }, process.env.JWT);
        const { password, ...others } = user._doc;
        console.log(token);
        res
            .cookie("access_token", token, {
                httpOnly: true,
            })
            .status(200)
            .json(others);
    } catch (err) {
        next(err);
    }
};


export {signin,signup}
