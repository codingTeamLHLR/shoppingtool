const { Schema, model } = require("mongoose");

const listSchema = new Schema(
    {
        name: String,
        description: String,
        user: {type: Schema.Types.ObjectId, ref: 'User'}
    },
    {
    timestamps: true,
    }
)

const List = model("List", listSchema);

module.exports = List;