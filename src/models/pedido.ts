import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { sequelize } from "../database/database.js";
import { ItemPedido } from "./itemPedido.js";
import { Cliente } from "./cliente.js";


export class Pedido extends Model<InferAttributes<Pedido>, InferCreationAttributes<Pedido>> {
    declare id: CreationOptional<number>;
    declare clienteId: number;
    declare data: CreationOptional<Date>;
    declare status: CreationOptional<"em_preparo" | "concluido" | "pago">;
    declare total: number;
    declare formaPagamento: "dinheiro" | "pix" | "cartao" | "nota" | null;
    declare caixaId: CreationOptional<number>;
    declare Cliente?: Cliente;
    declare itens?: ItemPedido[];

}

Pedido.init(
    {
        id: {
            type: DataTypes.INTEGER, primaryKey: true,
            autoIncrement: true
        },
        clienteId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        caixaId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        data: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        status: {
            type: DataTypes.ENUM("em_preparo", "concluido", "pago"),
            defaultValue: "em_preparo"
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        formaPagamento: {
            type: DataTypes.ENUM("dinheiro", "pix", "cartao", "nota"),
            allowNull: true
        },

    },
    {
        sequelize,
        modelName: "Pedido",
        tableName: "pedidos",
        timestamps: false
    }
);

Pedido.belongsTo(Cliente, { foreignKey: "clienteId" });
Cliente.hasMany(Pedido, { foreignKey: "clienteId" });

Pedido.hasMany(ItemPedido, { foreignKey: "pedidoId", as: "itens" });
ItemPedido.belongsTo(Pedido, { foreignKey: "pedidoId" });
