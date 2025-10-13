import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { sequelize } from "../database/index";

export class Cliente extends Model<InferAttributes<Cliente>, InferCreationAttributes<Cliente>> {
    declare id: number;
    declare nome: string;
}

Cliente.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    { sequelize, modelName: "Cliente", tableName: "clientes", timestamps: false }
);
