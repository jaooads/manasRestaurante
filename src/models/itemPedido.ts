import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { sequelize } from "../database/database.js";
import { Pedido } from "./pedido.js";

export class ItemPedido extends Model<InferAttributes<ItemPedido>, InferCreationAttributes<ItemPedido>> {
    declare id: CreationOptional<number>;
    declare pedidoId: number;
    declare descricao: string;
    declare quantidade: number;
    declare precoUnitario: number;
    declare produtoId: number;
}

ItemPedido.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, autoIncrement: true
        },
        pedidoId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        descricao: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quantidade: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        precoUnitario: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        produtoId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
    {
        sequelize, modelName: "ItemPedido",
        tableName: "itens_pedido",
        timestamps: false
    }
);

