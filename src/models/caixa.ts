import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { sequelize } from "../database/index";

export class Caixa extends Model<InferAttributes<Caixa>, InferCreationAttributes<Caixa>> {
    declare id: number;
    declare status: "aberto" | "fechado";
    declare dataAbertura: CreationOptional<Date>;
    declare dataFechamento: CreationOptional<Date>;
    declare totalVendido: CreationOptional<number>;
}

Caixa.init(
    {
        id: {
            type: DataTypes.INTEGER, primaryKey: true,
            autoIncrement: true
        },
        status: {
            type: DataTypes.ENUM("aberto", "fechado"),
            defaultValue: "aberto"
        },
        dataAbertura: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        dataFechamento: {
            type: DataTypes.DATE,
            allowNull: true
        },
        totalVendido: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
    },
    {
        sequelize, modelName: "Caixa",
        tableName: "caixas",
        timestamps: false
    }
);
