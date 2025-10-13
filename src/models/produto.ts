import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { sequelize } from "../database/index";

export class Produto extends Model<InferAttributes<Produto>, InferCreationAttributes<Produto>> {
    declare id: number;
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
