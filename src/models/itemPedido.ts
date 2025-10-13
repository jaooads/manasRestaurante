import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/index";
import { Pedido } from "./pedido";

export class ItemPedido extends Model { }

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
    },
    {
        sequelize, modelName: "ItemPedido",
        tableName: "itens_pedido",
        timestamps: false
    }
);

ItemPedido.belongsTo(Pedido, { foreignKey: "pedidoId" });
Pedido.hasMany(ItemPedido, { foreignKey: "pedidoId" });