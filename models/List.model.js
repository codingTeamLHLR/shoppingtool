const { Schema, model } = require("mongoose");

const listSchema = new Schema(
    {
        name: String,
        description: String
    },
    {
    timestamps: true,
    }
)

const List = model("List", listSchema);

module.exports = List;