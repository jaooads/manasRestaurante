import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { sequelize } from "../database/database.js";

export class Produto extends Model<InferAttributes<Produto>, InferCreationAttributes<Produto>> {
    declare id: CreationOptional<number>;
    declare nome: string;
    declare preco: number;
}

Produto.init(
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
        preco: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    },
    {
        sequelize, modelName: "Produto",
        tableName: "produtos",
        timestamps: false
    }
);
