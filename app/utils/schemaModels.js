import mongoose from "mongoose"

const Schema = mongoose.Schema

const SkillSchema = new Schema({
    title: String,
    type: String,
    cost: Number,
    power: Number,
    description: String,
    totalCost: Number,
    email: String,
})

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
})

const EnemySchema = new Schema({
    name: String,
    hp: Number,
    image: String,
    actions:[
        {
            actionType: String,
            power: Number
        },
    ],
    stage: Number,
})


export const SkillModel = mongoose.models.Skill || mongoose.model("Skill", SkillSchema)

export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema)

export const EnemyModel = mongoose.models.Enemy || mongoose.model("Enemy", EnemySchema)